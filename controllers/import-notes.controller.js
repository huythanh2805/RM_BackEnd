import ImportNotes from "../models/import-notes.js";

class ImportNotesController {
  async fetchListImportNotes(req, res) {
    try {
      const importNotes = await ImportNotes.find().populate("seller").populate("products.product");

      if (!importNotes || importNotes.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy phiếu nhập",
        });
      }

      return res.status(200).json(importNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách phiếu nhập thất bại",
        error: error.message,
      });
    }
  }

  async getDetailImportNotes(req, res) {
    try {
      const importNotes = await ImportNotes.findById(req.params.id).populate("seller").populate("products.product");

      if (!importNotes) {
        return res.status(404).json({
          message: "",
        });
      }

      return res.status(200).json(importNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Get detail importNotes failed",
        error: error.message,
      });
    }
  }

  async deleteImportNotes(req, res) {
    try {
      const importNotes = await ImportNotes.findByIdAndDelete(req.params.id);
      if (!importNotes) {
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

  async createImportNotes(req, res) {
    try {
      const importNotes = await ImportNotes.create(req.body);

      res.status(200).json({
        message: "Thêm mới phiếu nhập thành công!",
      });
      return res.status(201).json(importNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Thêm mới phiếu nhập thất bại",
        error: error.message,
      });
    }
  }

  async updateImportNotes(req, res) {
    try {
      const importNotes = await ImportNotes.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!importNotes) {
        return res.status(404).json({
          message: "Phiếu nhập không tồn tại",
        });
      }

      return res.status(200).json(importNotes);
    } catch (error) {
      return res.status(500).json({
        message: "Cập nhật phiếu nhập thất bại!",
        error: error.message,
      });
    }
  }
}

export default ImportNotesController;
