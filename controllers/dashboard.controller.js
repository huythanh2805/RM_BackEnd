import Bill from "../models/bill.js"
import BillDish from "../models/billDish.js"
import Reservation from "../models/reservation.js"
import { transformBills, transformReservationStatusQuantity } from "../uitls/Dashboard.js"

const getRevenueDashboard = async (req, res) => {
  const { startDate, endDate } = req.body
  try {
    if (startDate === "undefined" || endDate === "undefined")
      return res.status(401).json({ message: "Sai định dạng thời gian" })

    const localStart = new Date(new Date(startDate).getTime() + 7 * 60 * 60 * 1000); // GMT+7
    const localEnd = new Date(new Date(endDate).getTime() + 7 * 60 * 60 * 1000); // GMT+7
    const bills = await Bill.find({
      createdAt: {
        $gte: localStart, // Ngày lớn hơn hoặc bằng đầu tháng
        $lt: localEnd, // Ngày nhỏ hơn đầu tháng kế tiếp
      },
    })
    //   Fomat theo định dạng được yêu cầu trả về
    const allBill = transformBills(bills)
    return res.status(201).json(allBill)
  } catch (error) {
    console.error("Error in getMessagesByConversationId:", error)
    throw new Error("Failed to get messages")
  }
}
const getReservationStatusCount = async (req, res) => {
  const { startDate, endDate } = req.body
  try {
    if (startDate === "undefined" || endDate === "undefined")
      return res.status(401).json({ message: "Sai định dạng thời gian" })

        // Chuyển thời gian về giờ địa phương (GMT+7)
    const localStart = new Date(new Date(startDate).getTime() + 7 * 60 * 60 * 1000); // GMT+7
    const localEnd = new Date(new Date(endDate).getTime() + 7 * 60 * 60 * 1000); // GMT+7
    const reservations = await Reservation.find({
      status: { $in: ["COMPLETED", "CANCELED"] },  // Lọc trạng thái
      createdAt: {
        $gte: localStart, // Ngày lớn hơn hoặc bằng đầu tháng
        $lt: localEnd, // Ngày nhỏ hơn đầu tháng kế tiếp
      },
    });
    //   Fomat theo định dạng được yêu cầu trả về
    const AllReser = transformReservationStatusQuantity(reservations)
    return res.status(201).json(AllReser)
  } catch (error) {
    console.error("Error in getMessagesByConversationId:", error)
    throw new Error("Failed to get messages")
  }
}
const getTop5OrderedDishes = async (req, res) => {
  const { startDate, endDate } = req.body
 
  try {
    if (startDate === "undefined" || endDate === "undefined")
      return res.status(401).json({ message: "Sai định dạng thời gian" })
    const localStart = new Date(new Date(startDate).getTime() + 7 * 60 * 60 * 1000); // GMT+7
    const localEnd = new Date(new Date(endDate).getTime() + 7 * 60 * 60 * 1000); // GMT+7
    const topDishes = await BillDish.aggregate([
      // Bước 1: Lọc các billDish trong tháng và năm
      {
        $match: {
          createdAt: {
            $gte: localStart, // Ngày bắt đầu
            $lte: localEnd, // Ngày kết thúc
          },
        },
      },
      // Bước 2: Nhóm theo tên món ăn và tính tổng quantity
      {
        $group: {
          _id: "$name", // Nhóm theo tên món ăn
          quantity: { $sum: "$quantity" }, // Cộng dồn giá trị quantity
        },
      },
      // Bước 3: Sắp xếp theo số lượng giảm dần
      {
        $sort: { quantity: -1 },
      },
      // Bước 4: Lấy 5 món ăn đầu tiên
      {
        $limit: 5,
      },
    ])

    // Định dạng lại kết quả trả về
    const topDishesFormatted = topDishes.map((dish) => ({
      name: dish._id,
      quantity: dish.quantity,
    }))
    return res.status(201).json(topDishesFormatted)
  } catch (error) {
    console.error("Error fetching top dishes:", error)
    return []
  }
}
const getTop5OUserOrder = async (req, res) => {
  const { startDate, endDate } = req.body
 
  try {
    if (startDate === "undefined" || endDate === "undefined")
      return res.status(401).json({ message: "Sai định dạng thời gian" })
    const localStart = new Date(new Date(startDate).getTime() + 7 * 60 * 60 * 1000); // GMT+7
    const localEnd = new Date(new Date(endDate).getTime() + 7 * 60 * 60 * 1000); // GMT+7

    const topResers = await Reservation.aggregate([
      // Bước 1: Lọc các đơn hàng trong khoảng thời gian và loại bỏ user_id là null
      {
        $match: {
          createdAt: {
            $gte: localStart, // Ngày bắt đầu
            $lte: localEnd,   // Ngày kết thúc
          },
          user_id: { $ne: null }, // Loại bỏ các trường hợp có user_id = null
        },
      },
      // Bước 2: Nhóm theo user_id và đếm số lượng đơn hàng
      {
        $group: {
          _id: "$user_id",                  // Nhóm theo user_id
          totalOrders: { $sum: 1 },          // Đếm số đơn hàng (mỗi đơn cộng 1)
        },
      },
      // Bước 3: Kết hợp thông tin từ bảng User (dựa trên user_id)
      {
        $lookup: {
          from: "users",                    // Tên collection chứa thông tin user
          localField: "_id",                 // Trường trong Reservation (user_id)
          foreignField: "_id",               // Trường trong User (cũng là _id)
          as: "userInfo",                   // Alias cho kết quả kết hợp
        },
      },
      // Bước 4: Làm phẳng dữ liệu (flatten) từ mảng userInfo
      {
        $unwind: "$userInfo",               // Giải nén mảng userInfo để lấy thông tin user
      },
      // Bước 5: Chọn các trường cần thiết từ thông tin user
      {
        $project: {
          _id: 1,                          // Giữ nguyên _id là user_id
          totalOrders: 1,                   // Giữ nguyên số lượng đơn hàng
          userName: "$userInfo.userName",       // Tên người dùng
          phoneNumber: "$userInfo.phoneNumber",  // Số điện thoại
          email: "$userInfo.email",         // Email
        },
      },
      // Bước 6: Sắp xếp theo số đơn hàng giảm dần
      {
        $sort: { totalOrders: -1 },
      },
      // Bước 7: Lấy 5 người dùng đặt hàng nhiều nhất
      {
        $limit: 5,
      },
    ]);
 
 
    return res.status(201).json(topResers)
  } catch (error) {
    console.error("Error fetching top dishes:", error)
    return []
  }
}


export { 
     getRevenueDashboard,
     getTop5OrderedDishes,
     getReservationStatusCount,
     getTop5OUserOrder
}
