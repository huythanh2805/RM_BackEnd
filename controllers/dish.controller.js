import Dish from "../models/dish.js";

class DishController {
  async getAllDishes(req, res) {
    try {
      const dishes = await Dish.find({});

      if (!dishes || dishes.length === 0) {
        return res.status(404).json({
          message: "No dishes found",
        });
      }

      return res.status(200).json({
        data: dishes,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get all dishes failed",
        error: error.message,
      });
    }
  }

  async getDishDetail(req, res) {
    try {
      const dish = await Dish.findById(req.params.id);

      if (!dish) {
        return res.status(404).json({
          message: "Dish not found",
        });
      }

      return res.status(200).json({
        data: dish,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get dish detail failed",
        error: error.message,
      });
    }
  }

  async createDish(req, res) {
    try {
      const dish = await Dish.create(req.body);

      return res.status(201).json({
        data: dish,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Create dish failed",
        error: error.message,
      });
    }
  }

  async updateDish(req, res) {
    try {
      const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!dish) {
        return res.status(404).json({
          message: "Dish not found",
        });
      }

      return res.status(200).json({
        data: dish,
      });
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
}

export default DishController;
