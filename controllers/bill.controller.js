import Bill from "../models/bill.js";
import BillCombo from "../models/billCombo.js";
import BillDetail from "../models/billDetail.js";
import BillDish from "../models/billDish.js";
import notifications from "../models/notifications.js";
import Reservation from "../models/reservation.js";
import Table from "../models/table.js";
import UserDiscount from "../models/userDiscount.js";
import ReservationController from "./reservation.controller.js";

const reservationController = new ReservationController();

class BillController {
  constructor(io) {
    this.io = io;
  }
  // Get all bill
  getAll = async (req, res) => {
    try {
      const bills = await Bill.find({})
        .populate({
          path: "reservation_id",
          populate: {
            path: "user_id",
            model: "user",
          },
          populate: {
            path: "table_id",
            model: "table",
          },
        })
        .populate({
          path: "billDetail_id",
          populate: {
            path: "orderedDishes",
            model: "billDish",
          },
          populate: {
            path: "orderedCombos",
            model: "billCombo",
          },
        });

      if (bills.length === 0) {
        return res.status(200).json({
          message: "No bills found",
          bills: [],
        });
      }

      return res.status(200).json({ bills });
    } catch (error) {
      return res.status(500).json({
        message: "Get all bills failed",
        error: error.message,
      });
    }
  };

  // Create new bill
  createBill = async (req, res) => {
    try {
      const { reservation_id, original_money, total_money, discount_money, deposit_money, userDiscountId } = req.body;

      // Kiểm tra reservation có tồn tại không
      const reservation = await reservationController.getDetail(reservation_id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      const newBill = await Bill.create({
        reservation_id,
        original_money,
        total_money,
        discount_money,
        deposit_money,
        userDiscountId,
        status: "ISPAID",
      });
      if (!newBill) {
        return res.status(404).json({ message: "newBill isn't created" });
      }
      const billDetail = new BillDetail({
        bill_id: newBill._id,
      });
      for (const ordered_dish of reservation.ordered_dishes) {
        const billDish = await BillDish.create({
          name: ordered_dish.dish_id.name,
          price: ordered_dish.dish_id.price,
          images: ordered_dish.dish_id.images,
          desc: ordered_dish.dish_id.desc,
          quantity: ordered_dish.quantity,
        });
        billDetail.orderedDishes.push(billDish._doc._id);
      }
      for (const ordered_combos of reservation.ordered_combos) {
        const billCombo = await BillCombo.create({
          name: ordered_combos.setComboProduct_id.combo_id.name,
          price: ordered_combos.setComboProduct_id.combo_id.price,
          images: ordered_combos.setComboProduct_id.combo_id.images,
          desc: ordered_combos.setComboProduct_id.combo_id.desc,
          quantity: ordered_combos.quantity,
        });
        billDetail.orderedCombos.push(billCombo._doc._id);
      }

      const newBillDetail = await billDetail.save();

      await Bill.findByIdAndUpdate(newBill._id, {
        billDetail_id: newBillDetail._doc._id,
      });
      if (!newBillDetail) {
        return res.status(404).json({ message: "newBillDetail isn't created" });
      }
      await Reservation.findByIdAndUpdate(reservation._id, {
        status: "COMPLETED",
        userDiscountId: userDiscountId,
      });
      await Table.findByIdAndUpdate(reservation.table_id, {
        status: "AVAILABLE",
      });
      // Sửa lại userDiscount thành đã dùng
      if (userDiscountId) {
        await UserDiscount.findByIdAndUpdate(userDiscountId, { status: "USED" });
      }
      // Trả về kết quả thành công
      return res.status(201).json({
        message: "Bill created successfully",
        bill_id: newBill._id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  // Get bill by id
  getDetail = async (bill_id) => {
    const bill = await Bill.findById(bill_id)
      .populate({
        path: "reservation_id",
        populate: {
          path: "user_id",
          model: "user",
        },
        populate: {
          path: "table_id",
          model: "table",
        },
      })
      .populate({
        path: "billDetail_id",
        populate: [
          {
            path: "orderedDishes",
            model: "billDish",
          },
          {
            path: "orderedCombos",
            model: "billCombo",
          },
        ],
      });
    return bill;
  };
  getBillById = async (req, res) => {
    const { id } = req.params;
    try {
      const bill = await this.getDetail(id);
      if (!bill) return res.status(401).json({ message: "Can't find any bill with the same id" });
      return res.status(201).json({ message: "Can't find any bill with the same id", bill });
    } catch (error) {
      return res.status(501).json({ message: "Server Error" });
    }
  };

  createBillBank = async (reservation_id, total_money, original_money, discount_money, deposit_money) => {
    try {
      const reservation = await reservationController.getDetail(reservation_id);
      if (!reservation) {
        throw new Error("Reservation not found");
      }

      const newBill = await Bill.create({
        reservation_id,
        total_money,
        discount_money,
        deposit_money,
        original_money,
        status: "ISPAID",
      });
      if (!newBill) {
        throw new Error("New bill isn't created");
      }

      const billDetail = new BillDetail({ bill_id: newBill._id });

      for (const ordered_dish of reservation.ordered_dishes) {
        const billDish = await BillDish.create({
          name: ordered_dish.dish_id.name,
          price: ordered_dish.dish_id.price,
          images: ordered_dish.dish_id.images,
          desc: ordered_dish.dish_id.desc,
          quantity: ordered_dish.quantity,
        });
        billDetail.orderedDishes.push(billDish._doc._id);
      }

      for (const ordered_combos of reservation.ordered_combos) {
        const billCombo = await BillCombo.create({
          name: ordered_combos.setComboProduct_id.combo_id.name,
          price: ordered_combos.setComboProduct_id.combo_id.price,
          images: ordered_combos.setComboProduct_id.combo_id.images,
          desc: ordered_combos.setComboProduct_id.combo_id.desc,
          quantity: ordered_combos.quantity,
        });
        billDetail.orderedCombos.push(billCombo._doc._id);
      }

      const newBillDetail = await billDetail.save();
      if (!newBillDetail) {
        throw new Error("New bill detail isn't created");
      }

      await Bill.findByIdAndUpdate(newBill._id, {
        billDetail_id: newBillDetail._doc._id,
      });
      await Reservation.findByIdAndUpdate(reservation._id, {
        status: "COMPLETED",
      });
      await Table.findByIdAndUpdate(reservation.table_id, {
        status: "AVAILABLE",
      });
      this.io.emit("bank-payment-success");
      return {
        message: "Bill created successfully",
        bill_id: newBill._id,
      };
    } catch (error) {
      console.error("Error in createBillBank:", error);
      throw error;
    }
  };

  payment = async (req, res) => {
    try {
      console.log("Webhook received:", req.body);
      if (!req?.body?.content) {
        return res.status(400).send("Invalid content in response body");
      }
      console.log(req.body.content);
      const hihi = req.body.content.trim().split(/\s+/);
      if (!hihi) {
        return res.status(400).send("Transaction code not found in content");
      }
      const transactionCode = hihi[0];
      const original_money = hihi[1];
      const discount_money = hihi[2];
      const depositMoney = hihi[3];
      const result = depositMoney.slice(0, -2);

      const transferAmount = req?.body?.transferAmount;
      if (!transferAmount) {
        return res.status(400).send("Transfer amount not found");
      }
      const response = await this.createBillBank(
        transactionCode,
        transferAmount,
        original_money,
        discount_money,
        result
      );
      // Create a new notification
      const notification = new notifications({
        title: "Thanh toán thành công",
        message: `Đơn đặt bàn ${transactionCode} đã được thanh toán thành công.`,
      });

      await notification.save();

      this.io.emit("bank-payment-success", {
        title: notification.title,
        message: notification.message,
        bill_id: response.bill_id,
      });
      res.status(200).send(response);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).send("Internal server error");
    }
  };
}

export default BillController;
