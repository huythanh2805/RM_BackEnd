import OrderedCombo from "../models/orderedCombo.js"
import Reservation from "../models/reservation.js"
import SetComboProduct from "../models/SetComboProducts.js";
class OrderedComboController {
  // Get all
  getAllCombo = async (req, res) => {
    try {
     const combos = await SetComboProduct.find({}).populate([
        {
            path: "dishes",
            model: 'dish',
         },
        {
            path: "combo_id",
            model: 'setCombo',
            select: "price images desc name",
         },
     ])
     const splitCombo = combos.map(combo=>{
        const {_id, ...rest} = combo.combo_id
        return {
            ...rest._doc,
            ...combo._doc,
            dish_id: {...combo.combo_id._doc}
        }
     })
      return res.status(201).json(splitCombo)
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // add new
  addNewOrderedCombo = async (req, res) => {
    const { dish_id, reservation_id } = req.body
    if (!reservation_id || !dish_id)
      return res.status(401).json({ message: "All fields are required" })
    try {
      const orderedFood = await OrderedCombo.create({
        reservation_id,
        setComboProduct_id: dish_id,
      })
       await Reservation.findByIdAndUpdate(
        reservation_id,
        { $push: { ordered_combos : orderedFood._doc._id } }, // Dùng toán tử $push để thêm vào mảng
    );
    // populate 
    const combo = await OrderedCombo.findById(orderedFood._id).populate({
      path: 'setComboProduct_id',
      model: 'setComboProduct',
      populate: [
        {
            path: "combo_id",
            model: 'setCombo',
            select: "price images desc name",
         },
     ]
    })
   
    const {_id, ...rest} = combo.setComboProduct_id.combo_id
    const splitCombo = {
          ...rest._doc,
          ...combo._doc,
          type: 'combo',
          dish_id: {...combo.setComboProduct_id.combo_id._doc}
      }
      console.log(splitCombo)
      return res.status(201).json({ message: "Successfully", orderedFood:splitCombo})
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } 
  // Update ordered conbo
  async updateOrderCombo(req, res) {
    const orderedDish_id = req.params.orderedDishId
    const { quantity } = req.body
    if (!orderedDish_id)
      return res
        .status(401)
        .json({ message: "There is no Id to update ordered dish" })
    if (!quantity)
      return res.status(401).json({ message: "All data are required" })
    try {
        await OrderedCombo.findByIdAndUpdate(
        { _id: orderedDish_id },
        { quantity: quantity },
        { new: true }
      )
      return res
        .status(201)
        .json({ message: "Update Successfully!"})
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  // Delete deleteOrderedCombo
  async deleteOrderedCombo(req, res) {
    const {orderedDishId, reservationId} = req.params
    if (!orderedDishId)
      return res
        .status(401)
        .json({ message: "There is no Id to delete ordered dish" })
    try {
      await OrderedCombo.findByIdAndDelete(orderedDishId)
      await Reservation.updateOne(
        { _id: reservationId }, // Tìm document theo ID
        { $pull: { ordered_combos: orderedDishId } } 
      );
      return res.status(201).json({ message: "Successfully" })
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
//   // Update status orderedDish
//    updateOrderedDishesStatus = async (req, res) => {
//     try {
//       const { selectedRows, statusValue } = req.body; // Lấy dữ liệu từ body
  
//       if (!Array.isArray(selectedRows) || !selectedRows.length) {
//         return res.status(400).json({ message: 'Invalid selectedRows array' });
//       }
  
//       if (!statusValue) {
//         return res.status(400).json({ message: 'Invalid statusValue' });
//       }
  
//       // Cập nhật tất cả OrderedDish có _id nằm trong mảng selectedRows
//       const result = await OrderedDish.updateMany(
//         { _id: { $in: selectedRows } }, // Điều kiện tìm kiếm
//         { $set: { status: statusValue } } // Cập nhật status
//       );
  
//       // Trả về kết quả sau khi cập nhật
//       return res.status(200).json({
//         message: `${result.modifiedCount} dishes updated successfully.`,
//       });
//     } catch (error) {
//       return res.status(500).json({ message: 'Error updating dishes', error });
//     }
//   };
}

export default OrderedComboController
