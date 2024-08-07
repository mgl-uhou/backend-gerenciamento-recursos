import { Router  } from "express";
import employeeController from "./app/controllers/userController.js";

const router = Router();

/* router.get("/users", async (_req, res) => {
	const result = await pool.connection("SELECT * FROM employees;", [], "Couldn't get users");
	console.log(result);
	res.json(result);
}) */
router.get("/employees", employeeController.index.bind(employeeController));
router.get("/employees/:id", employeeController.show.bind(employeeController));
router.post("/employees", employeeController.store.bind(employeeController));
router.post("/login", employeeController.login.bind(employeeController));
router.put("/employees/:id", employeeController.update.bind(employeeController));
router.delete("/employees/:id", employeeController.delete.bind(employeeController));

export default router;