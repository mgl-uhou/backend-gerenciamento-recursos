import Controller from "./controller.js";
import { locationDepartmentRepository } from "../repositories/locationDepartmentsRepository.js";

class LocationDepartmentController extends Controller {
	constructor(tableName, columns) {
		super(tableName, columns);
	}

	async index(req, res) {
		try {
			if (!req.employee.isAdmin) return this.unauthorized(res);
			const result = await locationDepartmentRepository.getAll(
				this.getTableName()
			);
			if (!result) throw new Error("Couldn't get data");

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}

	async show(req, res) {
		try {
			if (!req.employee.isAdmin) return this.unauthorized();

			const { locationId, departmentId } = req.params;

			const result = await locationDepartmentRepository.getById(
				this.getTableName(),
				locationId,
				departmentId
			);
			if (!result) throw new Error("Couldn't get data");

			if (!result.length)
				return res.status(404).json({ message: "Record not exists" });

			res.status(200).json(result[0]);
		} catch (e) {
			res.status(400).json(e);
		}
	}

	async update(req, res) {
		try {
			if (!req.employee.isAdmin) return this.unauthorized();
			const { locationId, departmentId } = req.params;

			const element = await locationDepartmentRepository.getById(
				this.getTableName(),
				locationId,
				departmentId
			);
			if (!element.length)
				return res.status(404).json({ message: "Record not found" });

			const columns = Object.keys(req.body);
			const values = Object.values(req.body);
			const error = {};
			const success = {};

			this.attributeNotExists(req.body);

			for (const [index, column] of columns.entries()) {
				try {
					const result = await locationDepartmentRepository.updateRow(
						this.getTableName(),
						locationId,
						departmentId,
						column,
						values[index]
					);

					if(!result) throw new Error (`Couldn't update ${column}`);
					success[column] = result;
				} catch (e) {
					error[column] = e.message;
				}
			}
			res.json({ success, error })
		} catch (e) {
			res.status(500).json({
				error: "Error updating record",
				message: e.message,
			});
		}
	}

	async delete(req, res){
		try {
			if(!req.employee.isAdmin) return this.unauthorized();
			
			const { locationId, departmentId } = req.params;
			const result = await locationDepartmentRepository.deleteById(this.getTableName(), locationId, departmentId);

			if(!result) throw new Error("Couldn't delete data");

			if(!result.affectedRows) return res.status(404).json({ error: "Data not exists" });

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json({ error: e.message });
		}
	}
}

export const locationDepartmentsController = new LocationDepartmentController(
	"location_departments",
	["locationId", "departmentId", "minCapacity", "maxCapacity"]
);
