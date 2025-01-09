import mongoose from "mongoose";
import ExportNotes from "../models/export-notes.js";
import ImportNotes from "../models/import-notes.js";
import Product from "../models/product.js";
class ProductController {
  async fetchListProduct(req, res) {
    try {
      const products = await Product.find().populate("createdBy").exec();

      if (!products || products.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
        });
      }

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách nhà cung cấp thất bại",
        error: error.message,
      });
    }
  }

  async getDetailProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "",
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({
        message: "Get detail product failed",
        error: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
        });
      }
      return res.status(200).json({
        message: "Xoá sản phẩm thành công!",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Xoá sản phẩm thất bại",
        error: error.message,
      });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json({
        message: "Thêm mới sản phẩm thành công!",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Thêm mới sản phẩm thất bại",
        error: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!product) {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại",
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({
        message: "Cập nhật sản phẩm thất bại!",
        error: error.message,
      });
    }
  }

  async getProductHistory(req, res) {
    try {
      const productId = req.params.id;

      // Kiểm tra ID hợp lệ
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Product ID không hợp lệ" });
      }
      const objectId = new mongoose.Types.ObjectId(productId);

      // Lấy lịch sử nhập
      const importHistory = await ImportNotes.find({
        "products.product": objectId,
      })
        .populate("seller")
        .populate("products.product")
        .populate("createdBy");

      // Lấy lịch sử xuất
      const exportHistory = await ExportNotes.find({
        "stocks.stock": { $exists: true },
      })
        .populate({
          path: "stocks.stock",
          populate: {
            path: "product", // Đảm bảo populate lấy đầy đủ thông tin sản phẩm trong stock
            model: "product",
          },
        })
        .populate("createdBy");

      // Gộp lịch sử nhập và xuất
      const history = [
        ...importHistory.map((entry) => {
          const productEntry = entry.products.find((p) => p.product._id.toString() === productId);
          if (!productEntry) return null; // Bỏ qua nếu không tìm thấy sản phẩm

          return {
            type: "IMPORT",
            productName: productEntry.product.name, // Thêm tên sản phẩm từ product
            date: entry.createdAt,
            quantity: productEntry.quantity,
            price: productEntry.price,
            seller: entry.seller?.name || "N/A",
            createdBy: entry.createdBy?.userName || "N/A",
          };
        }).filter((item) => item !== null), // Loại bỏ các giá trị null

        ...exportHistory.map((entry) => {
          const stockEntry = entry.stocks.find(
            (s) => s.stock && s.stock.product._id.toString() === productId
          );
          if (!stockEntry) return null; // Bỏ qua nếu không tìm thấy sản phẩm

          return {
            type: "EXPORT",
            productName: stockEntry.stock.product.name, // Thêm tên sản phẩm từ stock
            date: entry.createdAt,
            quantity: stockEntry.quantity,
            price: stockEntry.price,
            createdBy: entry.createdBy?.userName || "N/A",
          };
        }).filter((item) => item !== null), // Loại bỏ các giá trị null
      ];

      // Sắp xếp theo ngày (mới nhất trước)
      history.sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.status(200).json(history);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy lịch sử nhập xuất thất bại",
        error: error.message,
      });
    }
  }


}

export default ProductController;
