import OrderedDish from "../models/orderedDish.js"
class OrderedFoodController {
  // Get all
  getAllOrderedFood = async (req, res) => {
    const { reservationId } = req.params
    if (!reservationId)
      return res.status(401).json({ message: "Missing reservation Id" })
    try {
      const orderedFoods = await OrderedDish.find({
        reservation_id: reservationId,
      }).populate("dish_id")
      return res.status(201).json(orderedFoods)
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // add new
  addNewOrderedDish = async (req, res) => {
    const { dish_id, reservation_id } = req.body
    if (!reservation_id || !dish_id)
      return res.status(401).json({ message: "All fields are required" })
    try {
      const orderedFood = await OrderedDish.create({
        reservation_id,
        dish_id,
      })
      // retrun newest orderedFood with address populate
      const newestOrderedFood = await OrderedDish.findById(
        orderedFood._id
      ).populate("dish_id")

      return res.status(201).json({ orderedFood: newestOrderedFood })
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // Update ordered dish
  async updateOrderedDish(req, res) {
    const orderedDish_id = req.params.orderedDishId
    const { quantity } = req.body
    if (!orderedDish_id)
      return res
        .status(401)
        .json({ message: "There is no Id to update ordered dish" })
    if (!quantity)
      return res.status(401).json({ message: "All data are required" })
    try {
      const updatedDish = await OrderedDish.findByIdAndUpdate(
        { _id: orderedDish_id },
        { quantity: quantity },
        { new: true }
      )
      return res
        .status(201)
        .json({ message: "Update Successfully!", orderedFood: updatedDish })
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // Delete orderedDish
  async deleteOrderedDish(req, res) {
    const orderedDish_id = req.params.orderedDishId
    if (!orderedDish_id)
      return res
        .status(401)
        .json({ message: "There is no Id to delete ordered dish" })
    try {
      await OrderedDish.findByIdAndDelete(orderedDish_id)

      return res.status(201).json({ message: "Successfully" })
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // Update status orderedDish
   updateOrderedDishesStatus = async (req, res) => {
    try {
      const { selectedRows, statusValue } = req.body; // Lấy dữ liệu từ body
  
      if (!Array.isArray(selectedRows) || !selectedRows.length) {
        return res.status(400).json({ message: 'Invalid selectedRows array' });
      }
  
      if (!statusValue) {
        return res.status(400).json({ message: 'Invalid statusValue' });
      }
  
      // Cập nhật tất cả OrderedDish có _id nằm trong mảng selectedRows
      const result = await OrderedDish.updateMany(
        { _id: { $in: selectedRows } }, // Điều kiện tìm kiếm
        { $set: { status: statusValue } } // Cập nhật status
      );
  
      // Trả về kết quả sau khi cập nhật
      return res.status(200).json({
        message: `${result.modifiedCount} dishes updated successfully.`,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating dishes', error });
    }
  };
}

export default OrderedFoodController
