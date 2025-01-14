import Stock from "../models/stock.js";
import TakeInventory from "../models/take-inventory.js";

class StockController {
  async fetchListStock(req, res) {
    try {
      const stock = await Stock.find({ quantity: { $gte: 1 } }).populate("product");

      if (!stock || stock.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy data",
        });
      }

      return res.status(200).json(stock);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách thất bại",
        error: error.message,
      });
    }
  }
  async fetchListStockStatus(req, res) {
    try {
      const stock = await Stock.find({ status: true, quantity: { $gte: 1 } }).populate("product");
      if (!stock || stock.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy data",
        });
      }

      return res.status(200).json(stock);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách thất bại",
        error: error.message,
      });
    }
  }

  async getDetailStock(req, res) {
    try {
      const stock = await Stock.findById(req.params.id);

      if (!stock) {
        return res.status(404).json({
          message: "stock not found",
        });
      }

      return res.status(200).json(stock);
    } catch (error) {
      return res.status(500).json({
        message: "Get detail stock failed",
        error: error.message,
      });
    }
  }

  async updateStock(req, res) {
    try {
      const stock = await Stock.findOneAndUpdate(
        { product: req.body.product },
        { $inc: { quantity: req.body.quantity } },
        { new: true, upsert: true }
      );

      if (!stock) {
        return res.status(404).json({
          message: "Data không tồn tại",
        });
      }

      return res.status(200).json(stock);
    } catch (error) {
      return res.status(500).json({
        message: "Cập nhật data thất bại123aa!",
        error: error.message,
      });
    }
  }

  async updateStockTakeInventory(req, res) {
    try {
      const { items, createdBy } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          message: "Không có dữ liệu để cập nhật",
        });
      }
      const bulkOps = items.map(item => ({
        updateOne: {
          filter: { _id: item.stockID },
          update: {
            $set: {
              quantity: item.newQuantity,
              expiryDate: item.newExpiryDate
            }
          }
        }
      }));
      const stock = await Stock.bulkWrite(bulkOps);
      const takeInventoryData = items.map(item => ({
        stock: item.stockID,
        price: item.price,
        lastQuantity: item.lastQuantity,
        newQuantity: item.newQuantity,
        lastExpiryDate: item.lastExpiryDate,
        newExpiryDate: item.newExpiryDate,
        createdBy: createdBy,
      }));

      const takeInventory = await TakeInventory.insertMany(takeInventoryData);

      return res.status(200).json({ message: 'Cập nhật thành công!', stock, takeInventory });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Cập nhật dữ liệu thất bại!",
        error: error.message,
      });
    }
  }

  async getListTakeInventoryByStockID(req, res) {
    try {
      const { id } = req.params;

      const takeInventories = await TakeInventory.find({ stock: id })
        .populate({
          path: 'stock',
          populate: { path: 'product' }
        }).populate("createdBy").sort({ createdAt: -1 })
        .exec();

      if (!takeInventories || takeInventories.length === 0) {
        return res.status(404).json({
          message: "No takeInventory found for the given stockId",
        });
      }

      return res.status(200).json(takeInventories || []);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to get takeInventory by stockId",
        error: error.message,
      });
    }
  }
}

export default StockController;
