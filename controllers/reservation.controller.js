import Reservation from "../models/reservation.js"
import Table from "../models/table.js"

class ReservationController {
  // add new reservation admin
  createReservation = async (req, res) => {
    const {
      table_id,
      userName,
      party_size,
      payment_method,
      startTime,
      detailAddress,
      phoneNumber,
    } = req.body
    console.log(req.body)
    try {
      if (
        !userName ||
        !party_size ||
        !payment_method ||
        !detailAddress ||
        !phoneNumber
      )
        return res.status(401).json({ message: "All data are required" })
      // 4: create reservation
      const newReservation = await Reservation.create({
        userName,
        party_size,
        payment_method,
        table_id,
        detailAddress,
        startTime,
        status: "SEATED",
        phoneNumber,
      })
      // 5: if create reservation successfully update table status
      if (newReservation) {
        await Table.findByIdAndUpdate(
          { _id: table_id },
          { status: "ISSERVING" },
          { new: true }
        )
      }
      return res
        .status(201)
        .json({ message: "Succussfully!", reservation: newReservation })
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // Get detail reservation by id
   getDetail = async (reservation_id)=>{
    const reservation = await Reservation.findById(reservation_id)
    .populate("table_id") // Populate thông tin table
    .populate("user_id") // Populate thông tin user
    .populate({
      path: "ordered_dishes", // Populate các dish liên quan
      populate: { 
        path: "dish_id", // Populate trường dish_id trong orderedDish
        model: "dish",   // Model của dish
     }
    })
    // .populate({
    //   path: "ordered_combos",
    //   populate: {
    //     path: "orderedCombo", // Populate các combo liên quan
    //     model: "setComboProduct", // Model tương ứng với combo
    //   },
    // })
    return reservation
   }
  getReservationById = async (req, res) => {
    try {
      const { reservation_id } = req.params

      // Tìm reservation theo ID và populate các trường liên quan
         const reservation = getDetail(reservation_id)

      // Kiểm tra nếu reservation không tồn tại
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" })
      }

      // Trả về thông tin reservation
      return res.status(200).json(reservation)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Server error" })
    }
  }
  // Get detail reservation by table status
  getReserDetail = async (req, res) => {
    const { table_id } = req.params
    if (!table_id) return res.status(201).json({ message: "Missing table id" })
    try {
      const tableDetail = await Table.findById(table_id)
      let reservationDetail
      if (tableDetail.status === "ISBOOKED") {
        reservationDetail = await Reservation.findOne({
          table_id: table_id,
          status: "RESERVED",
          prepay: { $gt: 0 },
          startTime: { $gte: new Date() },
        })
          .populate("user_id")
          .populate("table_id")
          .sort({ startTime: 1 })
          .exec()
        return res.status(201).json({ reservationDetail })
      } else if (tableDetail.status === "ISSERVING") {
        reservationDetail = await Reservation.findOne({
          table_id: table_id,
          status: "SEATED",
        })
          .populate("user_id")
          .populate("table_id")
        return res.status(201).json({ reservationDetail })
      }
      console.log({ reservationDetail })
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
}

export default ReservationController
