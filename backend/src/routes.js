import { Router } from "express";
import employeesController from "./app/controllers/employeesController.js";
import { departmentsController } from "./app/controllers/departmentsController.js";
import { locationsController } from "./app/controllers/locationsController.js";
import { locationDepartmentsController } from "./app/controllers/locationDepartmentsController.js";
import { assignmentsController } from "./app/controllers/assignmentsController.js";
import { authMiddleware } from "./app/middlewares/authMiddleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: 'json' };

const router = Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.get("/employees",authMiddleware, employeesController.index.bind(employeesController));
router.get("/employees/:id", authMiddleware, employeesController.show.bind(employeesController));
router.get("/profile", authMiddleware, employeesController.getProfile.bind(employeesController));
router.post("/employees", employeesController.store.bind(employeesController));
router.post("/login", employeesController.login.bind(employeesController));
router.put("/employees", authMiddleware, employeesController.updateSelf.bind(employeesController));
router.put("/employees/:id", authMiddleware, employeesController.updateByAdmin.bind(employeesController));
router.delete("/employees/:id", authMiddleware, employeesController.delete.bind(employeesController));
router.get("/show-assignments", authMiddleware, employeesController.showAssignments.bind(employeesController));

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
router.get("/location-departments/:locationId/:departmentId", authMiddleware, locationDepartmentsController.show.bind(locationDepartmentsController));
router.post("/location-departments", authMiddleware, locationDepartmentsController.store.bind(locationDepartmentsController));
router.put("/location-departments/:locationId/:departmentId", authMiddleware, locationDepartmentsController.update.bind(locationDepartmentsController));
router.delete("/location-departments/:locationId/:departmentId", authMiddleware, locationDepartmentsController.delete.bind(locationDepartmentsController));

router.get("/assignments", authMiddleware, assignmentsController.index.bind(assignmentsController));
router.get("/assignments/:id", authMiddleware, assignmentsController.show.bind(assignmentsController));
router.post("/assignments", authMiddleware, assignmentsController.store.bind(assignmentsController));
router.put("/assignments/:id", authMiddleware, assignmentsController.update.bind(assignmentsController));
router.delete("/assignments/:id", authMiddleware, assignmentsController.delete.bind(assignmentsController));

export default router;