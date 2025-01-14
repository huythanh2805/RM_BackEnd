import ExportNotes from "../models/export-notes.js";
import Stock from "../models/stock.js";


class ExportNotesController {
  async fetchListExportNotes(req, res) {
    try {
      const exportNotes = await ExportNotes.find()
        .populate({
          path: "stocks.stock", // Liên kết với `stock`
          populate: {
            path: "product", // Liên kết tiếp với `product`
            model: "product", // Tên model trong `productSchema`
          },
        })
        .populate("createdBy") // Liên kết với `user` từ `createdBy`
        .sort({ createdAt: -1 })
        .exec();
      if (!exportNotes || exportNotes.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy phiếu xuất",
        });
      }

      return res.status(200).json(exportNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách phiếu xuất thất bại",
        error: error.message,
      });
    }
  }


  async getDetailExportNotes(req, res) {
    try {
      const exportNotes = await ExportNotes.findById(req.params.id)
        .populate({
          path: "stocks.stock",
          populate: {
            path: "product",
            model: "product",
          },
        })
        .populate("createdBy")
        .exec();

      if (!exportNotes) {
        return res.status(404).json({
          message: "",
        });
      }

      return res.status(200).json(exportNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Get detail exportNotes failed",
        error: error.message,
      });
    }
  }

  async deleteExportNotes(req, res) {
    try {
      const exportNotes = await ExportNotes.findByIdAndDelete(req.params.id);
      if (!exportNotes) {
        return res.status(404).json({
          message: "Không tìm thấy phiếu nhập",
        });
      }
      return res.status(200).json({
        message: "Xoá phiếu nhập thành công!",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Xoá phiếu nhập thất bại",
        error: error.message,
      });
    }
  }

  async createExportNotes(req, res) {
    try {
      const { stocks, ...exportData } = req.body;
      // Cập nhật từng `Stock`
      await Promise.all(
        stocks.map(async (item) => {
          const stock = await Stock.findById(item.stock);

          if (!stock) {
            throw new Error(`Stock with ID ${item.stock} not found`);
          }

          if (item.quantity > stock.quantity) {
            throw new Error(`Quantity exceeds available stock for stock ID ${item.stock}`);
          }

          // Kiểm tra nếu quantity === maxQuantity
          if (item.quantity <= stock.quantity) {
            // Giảm số lượng trong `Stock`
            stock.quantity -= item.quantity;
            await stock.save();
          }

        })
      );

      // Sau khi cập nhật xong `Stock`, tạo `ExportNotes`
      const exportNotes = await ExportNotes.create({
        ...exportData,
        stocks, // Bao gồm thông tin `stocks`
      });

      return res.status(201).json(exportNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Thêm mới phiếu xuất thất bại",
        error: error.message,
      });
    }
  }

  async updateExportNotes(req, res) {
    try {
      const exportNotes = await ExportNotes.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!exportNotes) {
        return res.status(404).json({
          message: "Phiếu nhập không tồn tại",
        });
      }

      return res.status(200).json(exportNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Cập nhật phiếu nhập thất bại!",
        error: error.message,
      });
    }
  }
}

export default ExportNotesController;
