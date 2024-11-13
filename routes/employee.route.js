import express from "express";
import EmployeeController from "../controllers/employee.controller.js";

const router = express.Router();

const employeeController = new EmployeeController();

router.get("/employees", employeeController.getAllEmployees);
router.get("/employees/:id", employeeController.getDetailEmployee);
router.post("/employees", employeeController.createEmployee);
router.put("/employees/:id", employeeController.updateEmployee);
router.delete("/employees/:id", employeeController.deleteEmployee);

export default router;
