import { Router  } from "express";
import pool from "./app/database/pool.js";

const router = Router();

router.get("/users", async (_req, res) => {
	const result = await pool.connection("SELECT * FROM users;", [], "Couldn't get users");
	console.log(result);
	res.json(result);
})

export default router;