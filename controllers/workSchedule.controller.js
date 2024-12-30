import WorkSchedule from "../models/workSchedule.js";

class workScheduleController {
  async getAllworkSchedule(req, res) {
    try {
      const workSchedules = await WorkSchedule.find({}).populate(
        "employee_id",
        "name _id workPosition"
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
        "name _id workPosition"
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
      const { employee_id, month } = req.body;

      // Kiểm tra nếu employee đã có ca làm trong tháng đó
      const existingWorkSchedule = await WorkSchedule.findOne({
        employee_id,
        month,
      });

      if (existingWorkSchedule) {
        return res.status(400).json({
          message: `Employee with ID ${employee_id} already has a work schedule for month ${month}`,
        });
      }

      // Nếu không tồn tại, tạo ca làm việc mới
      const newWorkSchedule = new WorkSchedule(req.body);
      const savedWorkSchedule = await newWorkSchedule.save();

      return res.status(201).json({
        message: "WorkSchedule created successfully",
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
      const { employee_id, month } = req.body;

      const currentWorkSchedule = await WorkSchedule.findById(req.params.id);
      if (!currentWorkSchedule) {
        return res.status(404).json({
          message: "WorkSchedule not found",
        });
      }

      // Kiểm tra trùng lịch làm việc nếu employee_id hoặc month thay đổi
      if (
        (employee_id &&
          employee_id !== currentWorkSchedule.employee_id.toString()) ||
        (month && month !== currentWorkSchedule.month)
      ) {
        const existingWorkSchedule = await WorkSchedule.findOne({
          employee_id: employee_id || currentWorkSchedule.employee_id,
          month: month || currentWorkSchedule.month,
        });

        if (existingWorkSchedule) {
          return res.status(400).json({
            message: `Employee with ID ${
              employee_id || currentWorkSchedule.employee_id
            } already has a work schedule for month ${
              month || currentWorkSchedule.month
            }`,
          });
        }
      }

      // Cập nhật lịch làm việc
      const updatedWorkSchedule = await WorkSchedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("employee_id", "name _id workPosition");

      if (!updatedWorkSchedule) {
        return res.status(404).json({
          message: "WorkSchedule not found",
        });
      }

      return res.status(200).json({
        message: "WorkSchedule updated successfully",
        data: updatedWorkSchedule,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to update WorkSchedule",
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
