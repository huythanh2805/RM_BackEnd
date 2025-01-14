import cron from "node-cron";
import discount from "../models/discount.js";
import Reservation from "../models/reservation.js";
import stock from "../models/stock.js";

export const cancelPastReservations = async () => {
  try {
    const now = new Date();
    const expiredReservations = await Reservation.find({
      startTime: { $lt: now },
      status: { $in: ["ISWAITING", "ISCOMFIRMED", "ISPAYMENT"] },
    });
    for (const Reservation of expiredReservations) {
      Reservation.status = "CANCELED";
      await Reservation.save();
    }
    console.log(`Cron Job: Canceled ${expiredReservations.length} reservations.`);
  } catch (error) {
    console.error("Error in cancelPastReservations:", error);
  }
};
export const cancelDiscound = async () => {
  try {
    const currentDate = new Date();

    // Cập nhật trạng thái của các mã giảm giá đã hết hạn
    const result = await discount.updateMany(
      { expireDate: { $lt: currentDate }, isActive: true }, // Điều kiện
      { $set: { isActive: false } } // Cập nhật trạng thái
    );
  } catch (error) {
    console.error("Error running cron job:", error);
  }
};
export const updateStock = async () => {
  try {
    // Lấy danh sách tất cả sản phẩm từ cơ sở dữ liệu
    const stocks = await stock.find({});
    const now = new Date();
    for (const item of stocks) {
      if (item.expiryDate && new Date(item.expiryDate) < now) {
        await stock.updateOne(
          { _id: item._id },
          { $set: { status: false } }
        );
      }
    }

    console.log("Cập nhật trạng thái tồn kho hoàn tất.");
  } catch (error) {
    console.error("Error updating stock:", error);
  }
};

export const startCronJob = () => {
  cron.schedule("*/30 * * * *", cancelPastReservations);
  cron.schedule("0 0 * * *", cancelDiscound);
  cron.schedule("0 0 * * *", updateStock);
};
