import Seller from "../models/seller.js";

class SellerController {
  async fetchListSeller(req, res) {
    try {
      const sellers = await Seller.find({});

      if (!sellers || sellers.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy nhà cung cấp",
        });
      }

      return res.status(200).json(sellers);
    } catch (error) {
      return res.status(500).json({
        message: "Lấy danh sách nhà cung cấp",
        error: error.message,
      });
    }
  }

  async getDetailSeller(req, res) {
    try {
      const seller = await Seller.findById(req.params.id);

      if (!seller) {
        return res.status(404).json({
          message: "seller not found",
        });
      }

      return res.status(200).json(seller);
    } catch (error) {
      return res.status(500).json({
        message: "Get detail seller failed",
        error: error.message,
      });
    }
  }

  async deleteSellers(req, res) {
    try {
      const seller = await Seller.findByIdAndDelete(req.params.id);
      if (!seller) {
        return res.status(404).json({
          message: "Không tìm thấy nhà cung cấp",
        });
      }
      return res.status(200).json({
        message: "Xóa nhà cung cấp thành công",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Xóa nhà cung cấp thất bại",
        error: error.message,
      });
    }
  }

  async createSellers(req, res) {
    try {
      const seller = await Seller.create(req.body);

      return res.status(201).json(seller);
    } catch (error) {
      return res.status(500).json({
        message: "Create seller failed",
        error: error.message,
      });
    }
  }

  async updateSellers(req, res) {
    try {
      const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!seller) {
        return res.status(404).json({
          message: "seller not found",
        });
      }

      return res.status(200).json(seller);
    } catch (error) {
      return res.status(500).json({
        message: "Update v failed",
        error: error.message,
      });
    }
  }
}

export default SellerController;
