import WorkSchedule from "../models/workSchedule.js";

class workScheduleController {
  async getAllworkSchedule(req, res) {
    try {
      const workSchedules = await WorkSchedule.find({}).populate(
        "employee_id",
        "name _id"
      );

      if (!workSchedules || workSchedules.length === 0) {
        return res.status(404).json({
          message: "No workSchedule found",
        });
      }

      return res.status(200).json(workSchedules);
    } catch (error) {
      return res.status(500).json({
        message: "Get all workSchedule failed",
        error: error.message,
      });
    }
  }

  async getWorkScheduleDetail(req, res) {
    try {
      const workSchedule = await WorkSchedule.findById(req.params.id).populate(
        "employee_id",
        "name _id"
      );

      if (!workSchedule) {
        return res.status(404).json({
          message: "No workSchedule found",
        });
      }

      return res.status(200).json(workSchedule);
    } catch (error) {
      return res.status(500).json({
        message: "Get workSchedule Detail failed",
        error: error.message,
      });
    }
  }

  async createWorkSchedule(req, res) {
    try {
      const newWorkSchedule = new WorkSchedule(req.body);
      const savedWorkSchedule = await newWorkSchedule.save();

      return res.status(201).json({
        message: "workSchedule created successfully",
        data: savedWorkSchedule,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create workSchedule",
        error: error.message,
      });
    }
  }

  async updateWorkSchedule(req, res) {
    try {
      const updatedWorkSchedule = await WorkSchedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("employee_id", "name _id");

      if (!updatedWorkSchedule) {
        return res.status(404).json({
          message: "workSchedule not found",
        });
      }
      return res.status(200).json({
        message: "workSchedule update successfully",
        data: updatedWorkSchedule,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to update workSchedule",
        error: error.message,
      });
    }
  }

  async deleteWorkSchedule(req, res) {
    try {
      const deletedWorkSchedule = await WorkSchedule.findByIdAndDelete(
        req.params.id
      );

      if (!deletedWorkSchedule) {
        return res.status(404).json({
          message: "workSchedule not found",
        });
      }

      return res.status(200).json({
        message: "workSchedule deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete workSchedule",
        error: error.message,
      });
    }
  }
}

export default workScheduleController;
