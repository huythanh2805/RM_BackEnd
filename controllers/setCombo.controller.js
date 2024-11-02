import SetComBo from "../models/SetCombo.js";
import SetComBoProduct from "../models/SetComboProducts.js";

class SetComboController {
  async getAllSetCombos(req, res) {
    try {
      const setCombos = await SetComBo.find({});

      if (!setCombos || setCombos.length === 0) {
        return res.status(404).json({
          message: "No setCombos found",
        });
      }

      return res.status(200).json(setCombos);
    } catch (error) {
      return res.status(500).json({
        message: "Get all setCombos failed",
        error: error.message,
      });
    }
  }

  async getSetComboDetail(req, res) {
    try {
      const setCombo = await SetComBo.findById(req.params.id);

      if (!setCombo) {
        return res.status(404).json({
          message: "SetCombo not found",
        });
      }

      return res.status(200).json(setCombo);
    } catch (error) {
      return res.status(500).json({
        message: "Get setCombo detail failed",
        error: error.message,
      });
    }
  }

  async createSetCombo(req, res) {
    try {
      const existingSetCombo = await SetComBo.findOne({ name: req.body.name });
      if (existingSetCombo) {
        return res.status(400).json({
          message: "The setCombo name already exists",
        });
      }

      const { name, price, desc, isShow, dishes } = req.body;

      const images = req.files
        ? req.files.map((file) => file.path)
        : req.body.images;

      const newSetCombo = new SetComBo({ name, price, desc, isShow, images });
      await newSetCombo.save();

      const newSetComboProduct = new SetComBoProduct({
        dishes,
        combo_id: newSetCombo._id,
      });
      await newSetComboProduct.save();

      return res.status(201).json({
        setCombo: newSetCombo,
        setComboProduct: newSetComboProduct,
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
      const existingSetCombo = await SetComBo.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
      });
      if (existingSetCombo) {
        return res.status(400).json({
          message: "The setCombo name already exists",
        });
      }

      const { name, price, desc, isShow, dishes } = req.body;

      const images = req.files
        ? req.files.map((file) => file.path)
        : req.body.images;

      const updateData = { name, price, desc, isShow, images };
      const setCombo = await SetComBo.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!setCombo) {
        return res.status(404).json({
          message: "SetCombo not found",
        });
      }

      const setComboProduct = await SetComBoProduct.findOneAndUpdate(
        { combo_id: setCombo._id },
        { dishes },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        setCombo: setCombo,
        setComboProduct: setComboProduct,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Update setCombo failed",
        error: error.message,
      });
    }
  }

  async deleteSetCombo(req, res) {
    try {
      const setCombo = await SetComBo.findByIdAndDelete(req.params.id);

      if (!setCombo) {
        return res.status(404).json({
          message: "SetCombo not found",
        });
      }

      return res.status(200).json({
        message: "SetCombo deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete setCombo failed",
        error: error.message,
      });
    }
  }
}

export default SetComboController;
