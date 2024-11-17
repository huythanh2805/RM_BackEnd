import SetCombo from "../models/SetCombo.js";
import SetComboProduct from "../models/SetComboProducts.js";

class SetComboController {
  async getAllSetCombos(req, res) {
    try {
      const setCombos = await SetCombo.find({});

      const setCombosWithProducts = await Promise.all(
        setCombos.map(async (setCombo) => {
          const setComboProducts = await SetComboProduct.find({
            combo_id: setCombo._id,
          }).populate("dishes", "name price images");

          return {
            ...setCombo._doc,
            setComboProducts,
          };
        })
      );
      if (!setCombosWithProducts || setCombosWithProducts.length === 0) {
        return res.status(404).json({
          message: "No set combos found",
        });
      }

      return res.status(200).json(setCombosWithProducts);
    } catch (error) {
      return res.status(500).json({
        message: "Get all set combos failed",
        error: error.message,
      });
    }
  }

  async getSetComboDetail(req, res) {
    try {
      const setCombo = await SetCombo.findById(req.params.id);

      if (!setCombo) {
        return res.status(404).json({
          message: "Set combo not found",
        });
      }

      const setComboProducts = await SetComboProduct.find({
        combo_id: setCombo._id,
      }).populate("dishes", "name price images");

      return res.status(200).json({
        ...setCombo._doc,
        setComboProducts,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get set combo detail failed",
        error: error.message,
      });
    }
  }

  async createSetCombo(req, res) {
    try {
      const existingCombo = await SetCombo.findOne({ name: req.body.name });
      if (existingCombo) {
        return res.status(400).json({
          message: "The setCombo name already exists",
        });
      }

      const images = req.files
        ? req.files.map((file) => file.path)
        : req.body.images;

      const setCombo = await SetCombo.create({
        name: req.body.name,
        price: req.body.price,
        images,
        desc: req.body.desc,
        isShow: req.body.isShow,
      });

      const setComboProducts = await SetComboProduct.create({
        combo_id: setCombo._id,
        dishes: req.body.dishes,
      });

      return res.status(201).json({
        ...setCombo._doc,
        setComboProducts,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Create setCombo failed",
        error: error.message,
      });
    }
  }

  async updateSetCombo(req, res) {
    try {
      const existingCombo = await SetCombo.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
      });
      if (existingCombo) {
        return res.status(400).json({
          message: "The set combo name already exists",
        });
      }

      const images = req.files
        ? req.files.map((file) => file.path)
        : req.body.images;

      const updateData = {
        name: req.body.name,
        price: req.body.price,
        images,
        desc: req.body.desc,
        isShow: req.body.isShow,
      };

      const setCombo = await SetCombo.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

      const setComboProducts = await SetComboProduct.findOneAndUpdate(
        { combo_id: setCombo._id },
        { dishes: req.body.dishes },
        { new: true }
      );

      return res.status(200).json({
        ...setCombo._doc,
        setComboProducts,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Update set combo failed",
        error: error.message,
      });
    }
  }

  async deleteSetCombo(req, res) {
    try {
      const setCombo = await SetCombo.findByIdAndDelete(req.params.id);

      if (!setCombo) {
        return res.status(404).json({
          message: "Set combo not found",
        });
      }

      await SetComboProduct.deleteMany({ combo_id: req.params.id });

      return res.status(200).json({
        message: "Set combo deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete set combo failed",
        error: error.message,
      });
    }
  }
}

export default SetComboController;
