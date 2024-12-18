import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import { io } from "../index.js";
import notifications from "../models/notifications.js";
import OrderdCombo from "../models/orderedCombo.js";
import OrderedDish from "../models/orderedDish.js";
import Reservation from "../models/reservation.js";
import UserDiscount from "../models/userDiscount.js";

// APP INFO, STK TEST: 4111 1111 1111 1111
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

/**
 * methed: POST
 * Sandbox	POST	https://sb-openapi.zalopay.vn/v2/create
 * Real	POST	https://openapi.zalopay.vn/v2/create
 * description: tạo đơn hàng, thanh toán
 */
export const createZaloTransaction = async (req, res) => {
  const { totalPrice, ...rest } = req.body;
  const embed_data = {
    //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
    redirecturl: "http://localhost:4444/thanks",
    reservation: rest,
  };
  console.log(`${process.env.NGROK_BACKEND_URL}/api/payment/zalo/callback`);
  const items = [];
  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: totalPrice,
    //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
    //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
    callback_url: `${process.env.NGROK_BACKEND_URL}/api/payment/zalo/callback`,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;

  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });

    return res.status(200).json({ data: result.data });
  } catch (error) {
    console.log(error);
  }
};

/**
 * method: POST
 * description: callback để Zalopay Server call đến khi thanh toán thành công.
 * Khi và chỉ khi ZaloPay đã thu tiền khách hàng thành công thì mới gọi API này để thông báo kết quả.
 */
export const zaloTransactionCallback = async (req, res) => {
  let result = {};
  const data = JSON.parse(req.body.data);
  const embed_data = JSON.parse(data.embed_data);
  const { reservation } = embed_data;
  // console.log({embed_data})
  // console.log({reservation})

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      const { dishs, type, couponValue, ...rest } = reservation;
      // thanh toán thành công
      // Nếu trườnh hợp là update
      console.log({ id: reservation._id });
      console.log({ deposite: reservation.deposit });
      console.log({ type });
      if (type === "UPDATE") {
        console.log("update");
        await Reservation.findByIdAndUpdate(reservation._id, { deposit: reservation.deposit }, { new: true });
        return res.status(201).json({ message: "Cập nhật thành công" });
      }
      // Nếu trường hợp là tạo mới
      if (!req.body) return res.status(401).json({ message: "All data are required" });
      if (couponValue) {
        const userDiscount = await UserDiscount.findById(couponValue).populate("discountId");
        if (!userDiscount) {
          return res.status(401).json({ message: "Không tìm thấy mã giảm giá" });
        }
        if (!userDiscount.discountId.isActive) {
          return res.status(401).json({ message: "Mã giảm giá không còn hoạt động nữa" });
        }
      }
      console.log({
        status: "ISWAITING",
        userDiscountId: couponValue || null,
        ...rest,
      });

      // Tạo đặt chỗ
      const newReservation = await Reservation.create({
        status: "ISWAITING",
        userDiscountId: couponValue || null,
        ...rest,
      });

      if (!newReservation) return res.status(401).json({ message: "Can't Create new order" });
      // Cập nhật trạn thái của mã giảm giá
      if (couponValue) {
        await UserDiscount.findByIdAndUpdate(couponValue, { status: "USED" });
      }
      // Tạo mảng món ăn
      for (const orderedDish of dishs) {
        console.log({ orderedDish });
        if (orderedDish.type === "combo") {
          const newOrderedCombo = await OrderdCombo.create({
            setComboProduct_id: orderedDish.dish_id,
            quantity: orderedDish.quantity,
            reservation_id: newReservation._doc._id,
          });
          newReservation.ordered_combos.push(newOrderedCombo._doc._id);
        } else if (orderedDish.type === "dish") {
          const newOrderedDish = await OrderedDish.create({
            dish_id: orderedDish.dish_id,
            quantity: orderedDish.quantity,
            reservation_id: newReservation._doc._id,
          });
          newReservation.ordered_dishes.push(newOrderedDish._doc._id);
        }
      }
      await newReservation.save();

      // Tạo thông báo
      const notification = new notifications({
        title: "Yêu cầu đặt bàn mới",
        message: `Khách hàng ${reservation.userName} đã đặt bàn thành công. Vui lòng xác nhận.`,
      });
      await notification.save();
      // Phát sự kiện qua WebSocket
      io.emit("new-notification", {
        title: notification.title,
        message: notification.message,
      });

      // merchant cập nhật trạng thái cho đơn hàng ở đây
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

      result.return_code = 1;
      result.return_message = "success";
      return res.status(201).json({ message: "Đặt bàn thành công!" });
    }
  } catch (ex) {
    console.log("lỗi:::" + ex.message);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};
