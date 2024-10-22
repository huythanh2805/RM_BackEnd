import Reservation from "../models/reservation.js"
import Table from "../models/table.js"

class ReservationController {
  // Get all reservation
   getAllReser = async (req, res) => {
    try {
      const reservations = (await Reservation
        .find({})
        .sort({ createdAt: -1 })
        .populate("user_id")
        .populate("table_id")
        .populate("ordered_dishes"))
      return res.status(201).json({ reservations })

    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(501).json(
        { message: "Internal Server Error" },
      )
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
    return reservation
   }
  getReserDetailById = async (req, res) => {
    try {
      const { reservation_id } = req.params

      // Tìm reservation theo ID và populate các trường liên quan
         const reservation = await this.getDetail(reservation_id)


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
  getReserDetailByTableId = async (req, res) => {
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
  // add new reservation admin
  createReservation = async (req, res) => {
    const {
      table_id,
      userName,
      guests_count,
      payment_method,
      startTime,
      detailAddress,
      phoneNumber,
    } = req.body
    console.log(req.body)
    try {
      if (
        !userName ||
        !guests_count ||
        !payment_method ||
        !detailAddress ||
        !phoneNumber
      )
        return res.status(401).json({ message: "All data are required" })
      // 4: create reservation
      const newReservation = await Reservation.create({
        userName,
        guests_count,
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
  // Delete reservation by Array Id 
  deleteReservationByIdArray = async (req, res) => {
    const { IdArray: ArrayId } = req.body; // Lấy ArrayId từ body của request
    // Kiểm tra xem ArrayId có tồn tại và là một mảng hay không
    if (!ArrayId || !Array.isArray(ArrayId)) {
      return res.status(400).json({
        success: false,
        message: 'ArrayId is required and must be an array',
      });
    }
  
    try {
      // Sử dụng deleteMany để xóa các reservation có id nằm trong ArrayId
      const result = await Reservation.deleteMany({
        _id: { $in: ArrayId }, // Điều kiện _id nằm trong mảng ArrayId
      });
     
      // Kiểm tra xem có xóa được tài liệu nào không
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'No reservations found with the given ids',
        });
      }
  
      // Trả về kết quả thành công
      return res.status(200).json({
        success: true,
        message: `${result.deletedCount} reservations were deleted`,
      });
    } catch (error) {
      // Xử lý lỗi khi thực hiện xóa
      console.error('Error deleting reservations:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting reservations',
        error: error.message,
      });
    }
  };
  // Reselect table 
  reselectTable = async(
    req, res
  )=> {
    const {reservation_id, table_id} = req.body
    console.log({reservation_id, table_id})
    if (!reservation_id)
      return res.status(401).json(
        { message: "There is no Id to update reservation" },
      )
  
    try {
      const oldReservation = await Reservation.findById( reservation_id )
    
        await Table.updateOne(
          { _id: oldReservation.table_id },
          { $set: { status: "AVAILABLE" } }
        );
  
        await Table.findByIdAndUpdate(table_id, { $set: { status: "ISSERVING" } })
        //  update reservation table_id
        await Reservation.findByIdAndUpdate(
          { _id: reservation_id },
          { table_id: table_id },
        )
  
      return res.status(201).json({ message: "Successfully!" })
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json(
        { message: "Internal Server Error" },
      )
    }
  }
  // update reservation
  updateReservation = async(
    req, res
  )=> {
    const {
      table_id,
      userName,
      guests_count,
      payment_method,
      detailAddress,
      phoneNumber,
    } = req.body
    const {reservation_id} = req.params
    try {
      if (
        !userName ||
        !guests_count ||
        !payment_method ||
        !detailAddress ||
        !phoneNumber
      )
        return res.status(401).json({ message: "All data are required" })
      // 4: update reservation
      const newReservation = await Reservation.findByIdAndUpdate(reservation_id,{
        userName,
        guests_count,
        payment_method,
        table_id,
        detailAddress,
        phoneNumber,
      })
      return res
        .status(201)
        .json({ message: "Succussfully!"})
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    } }
}
export default ReservationController
