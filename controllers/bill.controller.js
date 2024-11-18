import Bill from "../models/bill.js";
import BillCombo from "../models/billCombo.js";
import BillDetail from "../models/billDetail.js";
import BillDish from "../models/billDish.js";
import Reservation from "../models/reservation.js";
import Table from "../models/table.js";
import ReservationController from "./reservation.controller.js";

const reservationController = new ReservationController();

class BillController {
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
      const { reservation_id, original_money } = req.body;

      // Kiểm tra reservation có tồn tại không
      const reservation = await reservationController.getDetail(reservation_id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      // Tạo bill mới
      const newBill = await Bill.create({
        reservation_id,
        original_money,
        status: "ISPAID",
      });
      if (!newBill) {
        return res.status(404).json({ message: "newBill isn't created" });
      }

      // Tạo billDetail
      const billDetail = new BillDetail({
        bill_id: newBill._id,
      });

      // Tạo mới billDish và insert vào billDetail
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
      // set lại trạng thái cho reservation và table
      await Reservation.findByIdAndUpdate(reservation._id, {
        status: "COMPLETED",
      });
      await Table.findByIdAndUpdate(reservation.table_id, {
        status: "AVAILABLE",
      });
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
      if (!bill)
        return res
          .status(401)
          .json({ message: "Can't find any bill with the same id" });
      return res
        .status(201)
        .json({ message: "Can't find any bill with the same id", bill });
    } catch (error) {
      return res.status(501).json({ message: "Server Error" });
    }
  };
}

export default BillController;
