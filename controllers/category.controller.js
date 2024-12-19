import Category from "../models/category.js";

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await Category.find({});

      if (!categories || categories.length === 0) {
        return res.status(404).json({
          message: "No categories found",
        });
      }

      return res.status(200).json({
        data: categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get all categories failed",
        error: error.message,
      });
    }
  }

  async getDetailCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      return res.status(200).json({
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get detail category failed",
        error: error.message,
      });
    }
  }

  async createCategory(req, res) {
    try {
      const category = await Category.create(req.body);

      return res.status(201).json({
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Create category failed",
        error: error.message,
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      return res.status(200).json({
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Update category failed",
        error: error.message,
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete category failed",
        error: error.message,
      });
    }
  }
}

export default CategoryController;
