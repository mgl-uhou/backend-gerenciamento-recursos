import repository from "../repositories/repository.js";
import Controller from "./controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class EmployeeController extends Controller{
	constructor(tableName){
		super(tableName);
	}

	async store(req, res) {
		try {
			const { email, password } = req.body;
			const users = await repository.getAll(this.getTableName());
			const thereIsUser = users.some(user => user.email === email);
			if(thereIsUser) throw new Error("User already exists");

			const hashPassword = await bcrypt.hash(password, 10);
			req.body.password = hashPassword;

			const result = await repository.insertRow(
				this.getTableName(),
				Object.keys(req.body),
				Object.values(req.body)
			);
			if (!result) throw new Error(`Couldn't insert data into ${this.getTableName()}`);
			
			/* const { password: _, ...user } = result;
			console.log(user); */
			
			res.status(201).json(result);
		} catch (e) {
			console.log(e);
			res.status(400).json({ error: e.message });
		}
	}
}

const employeeController = new EmployeeController("employees", [
	"id", 
	"firstName",
	"lastName",
	"email",
	"password",
	"vacationDays",
	"available",
	"position",
	"isAdmin", 
	"departmentId",
]);

export default employeeController;
