import Category from "../models/category.js";

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await Category.find({});

      if (!categories || categories.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy danh mục",
        });
      }

      return res.status(200).json({
        data: categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lấy tất cả danh mục thất bại",
        error: error.message,
      });
    }
  }

  async getDetailCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({
          message: "Không tìm thấy danh mục",
        });
      }

      return res.status(200).json({
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lấy chi tiết danh mục thất bại",
        error: error.message,
      });
    }
  }

  async createCategory(req, res) {
    try {
      const existingName = await Category.findOne({
        name: req.body.name,
      });
      if (existingName) {
        return res.status(400).json({
          message: "Tên danh mục đã tồn tại",
        });
      }

      const category = await Category.create(req.body);

      return res.status(201).json({
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Tạo danh mục thất bại",
        error: error.message,
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const existingName = await Category.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id }, // trừ id danh mục hiện tại tránh err khi update mà không thay đổi tên
      });
      if (existingName) {
        return res.status(400).json({
          message: "Tên danh mục đã tồn tại",
        });
      }

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!category) {
        return res.status(404).json({
          message: "Không tìm thấy danh mục",
        });
      }

      return res.status(200).json({
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Cập nhật danh mục thất bại",
        error: error.message,
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(404).json({
          message: "Không tìm thấy danh mục",
        });
      }

      return res.status(200).json({
        message: "Xóa danh mục thành công",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Xóa danh mục thất bại",
        error: error.message,
      });
    }
  }
}

export default CategoryController;
