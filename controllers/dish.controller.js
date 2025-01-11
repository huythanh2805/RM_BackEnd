import Dish from "../models/dish.js";

class DishController {
  async getAllDishes(req, res) {
    try {
      const dishes = await Dish.find({}).populate(
        "category_id",
        "name isDelete _id"
      );

      if (!dishes || dishes.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy món ăn",
        });
      }

      return res.status(200).json(dishes);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách món ăn thất bại",
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
          message: "Không tìm thấy món ăn",
        });
      }

      return res.status(200).json(dish);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy chi tiết món ăn thất bại",
        error: error.message,
      });
    }
  }

  async createDish(req, res) {
    try {
      const existingName = await Dish.findOne({ name: req.body.name });
      if (existingName) {
        return res.status(400).json({
          message: "Tên món ăn đã tồn tại",
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
        message: "Tạo món ăn thất bại",
        error: error.message,
      });
    }
  }

  async updateDish(req, res) {
    try {
      const existingName = await Dish.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id }, // trừ id món ăn hiện tại tránh err khi update mà không thay đổi tên
      });
      if (existingName) {
        return res.status(400).json({
          message: "Tên món ăn đã tồn tại",
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
        message: "Cập nhật món ăn thất bại",
        error: error.message,
      });
    }
  }

  async updateDishByCategory(req, res) {
    try {
      const { category_id, isShow } = req.body;

      const result = await Dish.updateMany(
        { category_id: category_id },
        { $set: { isShow: isShow } }
      );

      if (result.nModified === 0) {
        return res.status(404).json({
          message: "Không có sản phẩm nào được cập nhật.",
        });
      }

      res.status(200).json({
        message: "Cập nhật sản phẩm thành công.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Cập nhật món ăn thất bại",
        error: error.message,
      });
    }
  }

  async deleteDish(req, res) {
    try {
      const dish = await Dish.findByIdAndDelete(req.params.id);
      if (!dish) {
        return res.status(404).json({
          message: "Không tìm thấy món ăn",
        });
      }
      return res.status(200).json({
        message: "Xóa món ăn thành công",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Xóa món ăn thất bại",
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
          message: "Không tìm thấy món ăn",
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
        message: "Lấy các món ăn liên quan thất bại",
        error: error.message,
      });
    }
  }
}

export default DishController;
