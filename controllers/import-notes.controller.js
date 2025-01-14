import mongoose from "mongoose";
import ImportNotes from "../models/import-notes.js";
import Product from "../models/product.js";
import Stock from "../models/stock.js";

class ImportNotesController {
  async fetchListImportNotes(req, res) {
    try {
      const importNotes = await ImportNotes.find()
        .populate("seller")
        .populate("products.product")
        .populate("createdBy")
        .exec();

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
      const { id } = req.params; 
      const importNotes = await ImportNotes.findOne({
        $or: [
          { code: id.toString() },
          mongoose.isValidObjectId(id) ? { _id: id } : {},
        ],
      })
        .populate("seller")
        .populate("products.product")
        .populate("createdBy")
        .exec();
      if (!importNotes) {
        return res.status(404).json({
          message: "Phiếu nhập không tồn tại.",
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
      const { products, code, ...importData } = req.body;
      const existingImportNote = await ImportNotes.findOne({ code });
      if (existingImportNote) {
        return res.status(400).json({
          message: "Mã phiếu nhập đã tồn tại. Vui lòng sử dụng mã khác.",
        });
      }

      // Xử lý sản phẩm trong phiếu nhập
      const updatedProducts = await Promise.all(
        products.map(async (item) => {
          if (!item.product) {
            const existingProduct = await Product.findOne({ code: item?.code });
            if (existingProduct) {
              return { ...item, product: existingProduct._id };
            }
            const newProduct = await Product.create({
              code: item?.code,
              name: item?.name,
              category: item?.category,
              unit: item?.unit,
              createdBy: importData.createdBy,
            });
            return { ...item, product: newProduct._id };
          }
          return item;
        })
      );

      // Thêm sản phẩm vào kho
      await Promise.all(
        updatedProducts.map(async (item) => {
          await Stock.create({
            product: item.product,
            quantity: item.quantity,
            expiryDate: item?.expiryDate,
            price: item.price,
            codeImport: code,
            createdBy: importData.createdBy,
          });
        })
      );

      // Tạo phiếu nhập
      const importNotesData = {
        ...importData,
        code,
        products: updatedProducts,
      };
      const importNotes = await ImportNotes.create(importNotesData);

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
