import ExportNotes from "../models/export-notes.js";

class ExportNotesController {
  async fetchListExportNotes(req, res) {
    try {
      const exportNotes = await ExportNotes.find().populate("products.product");

      if (!exportNotes || exportNotes.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy phiếu nhập",
        });
      }

      return res.status(200).json(exportNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách phiếu nhập thất bại",
        error: error.message,
      });
    }
  }

  async getDetailExportNotes(req, res) {
    try {
      const exportNotes = await ExportNotes.findById(req.params.id).populate("products.product");

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
      const exportNotes = await ExportNotes.create(req.body);

      res.status(200).json({
        message: "Thêm mới phiếu nhập thành công!",
      });
      return res.status(201).json(exportNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Thêm mới phiếu nhập thất bại",
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
