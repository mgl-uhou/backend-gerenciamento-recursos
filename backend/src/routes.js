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

export default router;