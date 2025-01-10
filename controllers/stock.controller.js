import Stock from "../models/stock.js";

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
      const stock = await Stock.find({ status: true }).populate("product");
      console.log(stock);
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
        message: "Cập nhật data thất bại!",
        error: error.message,
      });
    }
  }
}

export default StockController;
