import Employee from "../models/employee.js";

class EmployeeController {
  async getAllEmployees(req, res) {
    try {
      const employees = await Employee.find({});

      if (!employees || employees.length === 0) {
        return res.status(404).json({
          message: "No employee found",
        });
      }

      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({
        message: "Get all employees failed",
        error: error.message,
      });
    }
  }

  async getDetailEmployee(req, res) {
    try {
      const employee = await Employee.findById(req.params.id);

      if (!employee) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }

      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({
        message: "Get detail employee failed",
        error: error.message,
      });
    }
  }

  async createEmployee(req, res) {
    try {
      const employee = await Employee.create(req.body);

      return res.status(201).json(employee);
    } catch (error) {
      return res.status(500).json({
        message: "Create employee failed",
        error: error.message,
      });
    }
  }

  async updateEmployee(req, res) {
    try {
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!employee) {
        return res.status(404).json({
          message: "employee not found",
        });
      }

      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({
        message: "Update employee failed",
        error: error.message,
      });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);

      if (!employee) {
        return res.status(404).json({
          message: "employee not found",
        });
      }

      return res.status(200).json({
        message: "Employee deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete employee failed",
        error: error.message,
      });
    }
  }
}

export default EmployeeController;
