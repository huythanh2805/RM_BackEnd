import Dish from "../models/dish.js";

class DishController {
  async getAllDishes(req, res) {
    try {
      const dishes = await Dish.find({}).populate("category_id", "name _id");

      if (!dishes || dishes.length === 0) {
        return res.status(404).json({
          message: "No dishes found",
        });
      }

      return res.status(200).json(dishes);
    } catch (error) {
      return res.status(500).json({
        message: "Get all dishes failed",
        error: error.message,
      });
    }
  }

  async getDishDetail(req, res) {
    try {
      const dish = await Dish.findById(req.params.id).populate(
        "category_id",
        "name _id"
      );

      if (!dish) {
        return res.status(404).json({
          message: "Dish not found",
        });
      }

      return res.status(200).json(dish);
    } catch (error) {
      return res.status(500).json({
        message: "Get dish detail failed",
        error: error.message,
      });
    }
  }

  async createDish(req, res) {
    try {
      const existingProduct = await Dish.findOne({ name: req.body.name });
      if (existingProduct) {
        return res.status(400).json({
          message: "The product name already exists",
        });
      }

      const images = req.files
        ? req.files.map((file) => file.path)
        : req.body.images;

      const dish = await Dish.create({
        ...req.body,
        images,
      });

      return res.status(201).json(dish);
    } catch (error) {
      return res.status(500).json({
        message: "Create dish failed",
        error: error.message,
      });
    }
  }

  async updateDish(req, res) {
    try {
      const existingProduct = await Dish.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id }, // trừ id món ăn hiện tại tránh err khi update mà không thay đổi tên
      });
      if (existingProduct) {
        return res.status(400).json({
          message: "The product name already exists",
        });
      }

      const images = req.files
        ? req.files.map((file) => file.path)
        : req.body.images;

      const updateData = {
        ...req.body,
        images,
      };

      const dish = await Dish.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      return res.status(200).json(dish);
    } catch (error) {
      return res.status(500).json({
        message: "Update dish failed",
        error: error.message,
      });
    }
  }

  async deleteDish(req, res) {
    try {
      const dish = await Dish.findByIdAndDelete(req.params.id);

      if (!dish) {
        return res.status(404).json({
          message: "Dish not found",
        });
      }

      return res.status(200).json({
        message: "Dish deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete dish failed",
        error: error.message,
      });
    }
  }

  async getRelatedDishes(req, res) {
    try {
      const { id } = req.params;

      const dish = await Dish.findById(id);

      if (!dish) {
        return res.status(404).json({
          message: "Dish not found",
        });
      }

      
      const relatedDishes = await Dish.find({
        category_id: dish.category_id,
        _id: { $ne: id },
        isShow: true,
      }).limit(5);

      return res.status(200).json(relatedDishes);
    } catch (error) {
      return res.status(500).json({
        message: "Get related dishes failed",
        error: error.message,
      });
    }
  }
}

export default DishController;
