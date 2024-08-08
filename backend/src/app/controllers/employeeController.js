import repository from "../repositories/repository.js";
import Controller from "./controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "../middlewares/authMiddleware.js";
dotenv.config();

class EmployeeController extends Controller{
	constructor(tableName){
		super(tableName);
	}

	async store(req, res) {
		try {
			const { email, password, vacationDays, available, isAdmin, departmentId, locationId } = req.body;
			const users = await repository.getAll(this.getTableName());
			const thereIsUser = users.some(user => user.email === email);
			if(thereIsUser) throw new Error("User already exists");

			if(vacationDays || available || isAdmin || departmentId || locationId){
				return res.status(403).json({ 
					error: "Forbidden: Unauthorized attributes.",
					attributes: [ 'vacationDays', 'available', 'isAdmin', 'departmentId', 'locationId' ] 
				})
			}

			const hashPassword = await bcrypt.hash(password, 10);
			req.body.password = hashPassword;

			const result = await repository.insertRow(
				this.getTableName(),
				Object.keys(req.body),
				Object.values(req.body)
			);
			if (!result) throw new Error(`Couldn't insert data into ${this.getTableName()}`);
			
			res.status(201).json(result);
		} catch (e) {
			console.log(e);
			res.status(400).json({ error: e.message });
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body;

			const users = await repository.getAll(this.getTableName());
			let user;
			for(let u of users)
				if(u.email === email)
					user = u;

			if(!user) throw new Error("Email or password is incorrect.");

			const verifyPass = await bcrypt.compare(password, user.password);
			if(!verifyPass) throw new Error("Email or password is incorrect.");

			const token = jwt.sign({ 
				id: user.id, 
			}, process.env.jwt_pass, { expiresIn: "8h" });

			const { password: _, ...userData} = user;
			res.status(200).json({ user: userData, token });
		} catch (e) {
			console.log(e);
			res.status(404).json({ error: e.message });
		}
	}

	async getProfile(req, res){
		try {
			res.status(200).json(req.employee);
		} catch (e) {
			res.status(401).json({ error: e.message });			
		}	
	}

	/**
	 * 
	 * @param {Array} columns Array of column names.
	 * @param {Array} values Array of values corresponding to the array of columns
	 * @param {number} id Id's number of the record.
	 * @returns Object with two properties: error and success.
	 */
	async update(columns, values, id){
		const error = {};
		const success = {};

		for (const [index, column] of columns.entries()) {
			// column is the value
			try {
				const result = await repository.updateRow(
					this.getTableName(),
					column,
					values[index],
					id
				);
				console.log(result);
				
				if (!result) throw new Error(`Could't update ${column}`);
				success[column] = result;
			} catch (e) {
				error[column] = e.message;
			}
		}
		return { error, success };
	}

	async updateSelf(req, res){
		try {
			const id = req.employee.id;
			const element = await repository.getById(this.getTableName(), id);
			if (!element.length) return res.status(404).json({ message: "Record not found" });

			const { vacationDays, available, isAdmin, departmentId, locationId } = req.body;
			if(vacationDays || available || isAdmin || departmentId || locationId){
				return res.status(403).json({ 
					error: "Forbidden: Unauthorized attributes.",
					"attributes": [ 'vacationDays', 'available', 'isAdmin', 'departmentId', 'locationId' ] 
				})
			}

			if(req.body.password) 
				req.body.password = await bcrypt.hash(req.body.password, 10);

			const columns = Object.keys(req.body);
			const values = Object.values(req.body);

			const { error, success } = await this.update(columns, values, id);
			res.json({ success, error });
		} catch (e) {
			res.status(500).json({ error: "Error updating record", e });
		}
	}

	async updateByAdmin(req, res){
		try {
			if(!req.employee.isAdmin) return res.status(401).json({ error: "Unauthorized."});

			const recordId = req.params.id;
			const element = await repository.getById(this.getTableName(), recordId);
			if (!element.length) return res.status(404).json({ message: "Record not found" });

			if(req.body.password) delete req.body.password;

			const columns = Object.keys(req.body);
			const values = Object.values(req.body);
			const { error, success } = await this.update(columns, values, recordId);
			res.json({ message: "Password  changed only by the employee on common route.", success, error });
		} catch (e){
			res.status(400).json({ error: "Error updating record", e });	
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
