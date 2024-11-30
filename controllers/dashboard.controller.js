import Bill from "../models/bill.js"
import BillDish from "../models/billDish.js"
import Reservation from "../models/reservation.js"
import { getBillQuantitiesByDay, getReservationStatusesByDay } from "../uitls/Dashboard.js"

const getRevenueDashboard = async (req, res) => {
  const { month, year } = req.params
  // Ngày đầu tháng
  const startDate = new Date(year, parseInt(month) - 1, 1) // 2024-11-01T00:00:00.000Z
  // Ngày đầu tháng sau
  const endDate = new Date(year, parseInt(month), 1)
  try {
    if (!month || month === "undefined")
      return res.status(401).json({ message: "Month must be required" })
    // Tìm tất cả các tin nhắn có conversationId phù hợp
    // const messages = await Message.find({ conversationId }).populate('senderId').sort({ timestamp: 1 });
    const bills = await Bill.find({
      createdAt: {
        $gte: startDate, // Ngày lớn hơn hoặc bằng đầu tháng
        $lt: endDate, // Ngày nhỏ hơn đầu tháng kế tiếp
      },
    })
    //   Fomat theo định dạng được yêu cầu trả về
    const allBill = getBillQuantitiesByDay(bills, month, year)
    return res.status(201).json(allBill)
  } catch (error) {
    console.error("Error in getMessagesByConversationId:", error)
    throw new Error("Failed to get messages")
  }
}
const getTop5OrderedDishes = async (req, res) => {
  const { month, year } = req.params
  // Ngày đầu tháng
  const startDate = new Date(year, parseInt(month) - 1, 1) // 2024-11-01T00:00:00.000Z
  // Ngày đầu tháng sau
  const endDate = new Date(year, parseInt(month), 1)
  try {
    const topDishes = await BillDish.aggregate([
      // Bước 1: Lọc các billDish trong tháng và năm
      {
        $match: {
          createdAt: {
            $gte: startDate, // Ngày bắt đầu
            $lte: endDate, // Ngày kết thúc
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
const getTotalRevenueByMonth = async (req, res) => {
  const { month, year } = req.params // Lấy tháng và năm từ request params

  // Xác định ngày đầu tiên và cuối cùng của tháng được chỉ định
  const startOfMonth = new Date(year, month - 1, 1) // Tháng bắt đầu (0-indexed)
  const endOfMonth = new Date(year, month, 0) // Ngày cuối cùng của tháng

  // Tạo một mảng các tháng để lấy dữ liệu từ tháng hiện tại và 5 tháng trước đó
  const monthsToFetch = []
  for (let i = 0; i < 6; i++) {
    const currentMonth = new Date(startOfMonth)
    currentMonth.setMonth(startOfMonth.getMonth() - i)

    const startOfMonthCurrent = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    )
    const endOfMonthCurrent = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    )

    monthsToFetch.push({
      start: startOfMonthCurrent,
      end: endOfMonthCurrent,
    })
  }

  try {
    // Tổng hợp doanh thu cho từng tháng
    const revenueData = []

    for (let i = 0; i < monthsToFetch.length; i++) {
      const { start, end } = monthsToFetch[i]

      // Sử dụng aggregate để tính tổng doanh thu cho mỗi tháng
      const revenue = await Bill.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start, // Ngày bắt đầu của tháng
              $lte: end, // Ngày kết thúc của tháng
            },
          },
        },
        {
          $group: {
            _id: null, // Không cần nhóm theo trường nào, chỉ tính tổng
            total_money: { $sum: "$original_money" }, // Cộng dồn trường original_money
          },
        },
      ])

      // Thêm kết quả vào mảng revenueData
      revenueData.push({
        month:
          start.toLocaleString("default", { month: "long" }) +
          " " +
          start.getFullYear(),
        total_money: revenue[0] ? revenue[0].total_money : 0, // Nếu không có dữ liệu thì trả về 0
      })
    }

    return res.status(201).json(revenueData)
  } catch (error) {
    return res.status(501).json({ message: "error" })
  }
}

const getReservationStatusCount = async (req, res) => {
  const { month, year } = req.params // Lấy tháng và năm từ request params


    const startDate = new Date(year, parseInt(month) - 1, 1) // 2024-11-01T00:00:00.000Z
    // Ngày đầu tháng sau
    const endDate = new Date(year, parseInt(month), 1)
    try {
      if (!month || month === "undefined")
        return res.status(401).json({ message: "Month must be required" })
      // Tìm tất cả các tin nhắn có conversationId phù hợp
      // const messages = await Message.find({ conversationId }).populate('senderId').sort({ timestamp: 1 });
      const reservations = await Reservation.find({
        createdAt: {
          $gte: startDate, // Ngày lớn hơn hoặc bằng đầu tháng
          $lt: endDate, // Ngày nhỏ hơn đầu tháng kế tiếp
        },
      })
      //   Fomat theo định dạng được yêu cầu trả về
      const allBill = getReservationStatusesByDay(reservations, month, year)
      return res.status(201).json(allBill)
    } catch (error) {
      console.error("Error in getMessagesByConversationId:", error)
      throw new Error("Failed to get messages")
    }
}



export { 
     getRevenueDashboard,
     getTop5OrderedDishes,
     getTotalRevenueByMonth,
     getReservationStatusCount,
     }
