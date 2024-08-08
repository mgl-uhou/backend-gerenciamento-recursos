import { Router } from "express";
import employeeController from "./app/controllers/employeeController.js";
import { departmentsController } from "./app/controllers/departmentsController.js";
import { authMiddleware } from "./app/middlewares/authMiddleware.js";

const router = Router();

/* router.get("/users", async (_req, res) => {
	const result = await pool.connection("SELECT * FROM employees;", [], "Couldn't get users");
	console.log(result);
	res.json(result);
}) */
router.get("/employees",authMiddleware, employeeController.index.bind(employeeController));
router.get("/employees/:id", authMiddleware, employeeController.show.bind(employeeController));
router.get("/profile", authMiddleware, employeeController.getProfile.bind(employeeController));
router.post("/employees", authMiddleware, employeeController.store.bind(employeeController));
router.post("/login", employeeController.login.bind(employeeController));
router.put("/employees", authMiddleware, employeeController.updateSelf.bind(employeeController));
router.put("/employees/:id", authMiddleware, employeeController.updateByAdmin.bind(employeeController));
router.delete("/employees/:id", authMiddleware, employeeController.delete.bind(employeeController));

router.get("/departments", authMiddleware, departmentsController.index.bind(departmentsController));
router.get("/departments/:id", authMiddleware, departmentsController.show.bind(departmentsController));
router.post("/departments", authMiddleware, departmentsController.store.bind(departmentsController));
router.put("/departments/:id", authMiddleware, departmentsController.update.bind(departmentsController));
router.delete("/departments/:id", authMiddleware, departmentsController.delete.bind(departmentsController));

export default router;