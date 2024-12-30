import OrderDishHistory from "../models/order-dish-history.js"; 

const getOrderDishHistoryById = async (req, res) => {
    const id = req.params.id;
    try {
        if(!id) return res.status(401).json({ message: "Can't find id!"});
        const orderDishHistories = await OrderDishHistory.find({reservation_id: id})
        .populate({
            path: 'changer_id',
            model: 'user'
        })
        .populate({
            path: 'ordered_dish',
            model: 'orderedDish',
            populate: {
             path: 'dish_id',
             model: 'dish'
            }
        })
        .populate({
            path: 'ordered_combo',
            model: 'orderedCombo',
            populate: {
             path: 'setComboProduct_id',
             model: 'setComboProduct',
             populate: {
              path: 'combo_id',
              model: 'setCombo'
             }
        }})
        .populate({
            path: 'reservation_id',
            model: 'reservation',
            select: 'table_id',
            populate: {
                path: 'table_id',
                model: 'table',
                select: 'name'
            }
        })
        .sort({createdAt: 1})
        return res.status(201).json(orderDishHistories);
    } catch (error) {
        console.log("OrderDishHistoryError: ",error)
        return res.status(501).json({ message: "Something went wrong with server !"});
    }
}

export {
    getOrderDishHistoryById
}