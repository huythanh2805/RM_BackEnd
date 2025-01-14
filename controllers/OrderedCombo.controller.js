import OrderedCombo from "../models/orderedCombo.js"
import Reservation from "../models/reservation.js"
import SetComboProduct from "../models/SetComboProducts.js";
import OrderDishHistory from "../models/order-dish-history.js"; 
import KitchenNotify from "../models/kitchenNotify.js";
import { generateUUID } from "../uitls/GenerateUUID.js";
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
    const { dish_id, reservation_id , user_id, quantity} = req.body
    
    if (!reservation_id || !dish_id)
      return res.status(401).json({ message: "All fields are required" })
    try {
        const code = generateUUID()
        const orderedFood = await OrderedCombo.create({
          code,
          quantity,
          reservation_id,
          setComboProduct_id: dish_id,
        })
         await OrderDishHistory.create({
           code,
           reservation_id,
           quantity,
           changer_id: user_id,
           ordered_combo: orderedFood._doc._id,
         })
         await Reservation.findByIdAndUpdate(
           reservation_id,
           { $push: { ordered_combos: orderedFood._doc._id } } // Dùng toán tử $push để thêm vào mảng
         )
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
      return res.status(201).json({ message: "Successfully", orderedFood:splitCombo})
    } catch (error) {
      console.log("Inventories_Error", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } 
  // Update ordered conbo
  async updateOrderCombo(req, res) {
    const {orderedFoodId, newStatus, reservation_id, code, changer_id, quantity} = req.body
    if (!orderedFoodId)  return res.status(401).json({ message: "Id is not existed" })
    console.log(req.body)
    try {

      const orderedCombo = await OrderedCombo.findById(orderedFoodId)

      if(orderedCombo && orderedCombo._doc.isRequiredToCancel && newStatus === "ISCANCELED") {
        await OrderedCombo.findByIdAndUpdate(orderedFoodId, { status: newStatus, isRequiredToCancel: false }, { new: true });
        await KitchenNotify.findOneAndUpdate({orderedCode: orderedCombo._doc.code}, {isConfirmed: true})
      }else{
        await OrderedCombo.findByIdAndUpdate(orderedFoodId, { status: newStatus }, { new: true });
      }

      await OrderDishHistory.create({
        code,
        reservation_id,
        quantity,
        changer_id,
        ordered_combo: orderedFoodId,
        currentStatus: newStatus,
        previousStatus: orderedCombo._doc.status
      })
      return res.status(201).json({ message: "Successfully"})
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
}

export default OrderedComboController
