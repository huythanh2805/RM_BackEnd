import Product from "../models/product.js";

class ProductController {
  async fetchListProduct(req, res) {
    try {
      const products = await Product.find({});

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

      res.status(200).json({
        message: "Thêm mới sản phẩm thành công!",
      });
      return res.status(201).json(product);
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
}

export default ProductController;
