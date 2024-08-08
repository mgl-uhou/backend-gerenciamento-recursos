import { Router } from "express";
import employeesController from "./app/controllers/employeesController.js";
import { departmentsController } from "./app/controllers/departmentsController.js";
import { locationsController } from "./app/controllers/locationsController.js";
import { locationDepartmentsController } from "./app/controllers/locationDepartmentsController.js";
import { vacationsController } from "./app/controllers/vacationsController.js";
import { assignmentsController } from "./app/controllers/assignmentsController.js";
import { authMiddleware } from "./app/middlewares/authMiddleware.js";

const router = Router();

/* router.get("/users", async (_req, res) => {
	const result = await pool.connection("SELECT * FROM employees;", [], "Couldn't get users");
	console.log(result);
	res.json(result);
}) */
router.get("/employees",authMiddleware, employeesController.index.bind(employeesController));
router.get("/employees/:id", authMiddleware, employeesController.show.bind(employeesController));
router.get("/profile", authMiddleware, employeesController.getProfile.bind(employeesController));
router.post("/employees", authMiddleware, employeesController.store.bind(employeesController));
router.post("/login", employeesController.login.bind(employeesController));
router.put("/employees", authMiddleware, employeesController.updateSelf.bind(employeesController));
router.put("/employees/:id", authMiddleware, employeesController.updateByAdmin.bind(employeesController));
router.delete("/employees/:id", authMiddleware, employeesController.delete.bind(employeesController));

router.get("/departments", authMiddleware, departmentsController.index.bind(departmentsController));
router.get("/departments/:id", authMiddleware, departmentsController.show.bind(departmentsController));
router.post("/departments", authMiddleware, departmentsController.store.bind(departmentsController));
router.put("/departments/:id", authMiddleware, departmentsController.update.bind(departmentsController));
router.delete("/departments/:id", authMiddleware, departmentsController.delete.bind(departmentsController));

router.get("/locations", authMiddleware, locationsController.index.bind(locationsController));
router.get("/locations/:id", authMiddleware, locationsController.show.bind(locationsController));
router.post("/locations", authMiddleware, locationsController.store.bind(locationsController));
router.put("/locations/:id", authMiddleware, locationsController.update.bind(locationsController));
router.delete("/locations/:id", authMiddleware, locationsController.delete.bind(locationsController));

router.get("/location-departments", authMiddleware, locationDepartmentsController.index.bind(locationDepartmentsController));
router.get("/location-departments/:id", authMiddleware, locationDepartmentsController.show.bind(locationDepartmentsController));
router.post("/location-departments", authMiddleware, locationDepartmentsController.store.bind(locationDepartmentsController));
router.put("/location-departments/:id", authMiddleware, locationDepartmentsController.update.bind(locationDepartmentsController));
router.delete("/location-departments/:id", authMiddleware, locationDepartmentsController.delete.bind(locationDepartmentsController));

router.get("/vacations", authMiddleware, vacationsController.index.bind(vacationsController));
router.get("/vacations/:id", authMiddleware, vacationsController.show.bind(vacationsController));
router.post("/vacations", authMiddleware, vacationsController.store.bind(vacationsController));
router.put("/vacations/:id", authMiddleware, vacationsController.update.bind(vacationsController));
router.delete("/vacations/:id", authMiddleware, vacationsController.delete.bind(vacationsController));

router.get("/assignment", authMiddleware, assignmentsController.index.bind(assignmentsController));
router.get("/assignment/:id", authMiddleware, assignmentsController.show.bind(assignmentsController));
router.post("/assignment", authMiddleware, assignmentsController.store.bind(assignmentsController));
router.put("/assignment/:id", authMiddleware, assignmentsController.update.bind(assignmentsController));
router.delete("/assignment/:id", authMiddleware, assignmentsController.delete.bind(assignmentsController));

export default router;