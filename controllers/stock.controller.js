import Stock from "../models/stock.js";

class StockController {
  async fetchListStock(req, res) {
    try {
      const stock = await Stock.find().populate("product");

      if (!stock || stock.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy data",
        });
      }

      return res.status(200).json(stock);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách nhà cung cấp thất bại",
        error: error.message,
      });
    }
  }

  async updateStock(req, res) {
    try {
      const stock = await Stock.findOneAndUpdate(
        { product: req.body.product },
        { $inc: { quantity: req.body.quantity } }, // Thêm hoặc bớt số lượng
        { new: true, upsert: true } // Tạo mới nếu chưa tồn tại
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
