import Controller from "./controller.js";
import { locationDepartmentRepository } from "../repositories/locationDepartmentsRepository.js";

class LocationDepartmentController extends Controller {
	constructor(tableName, columns) {
		super(tableName, columns);
	}

	async index(req, res) {
		try {
			if (!req.employee.isAdmin) return this.unauthorized(res);
			const result = await locationDepartmentRepository.getAll(this.getTableName());
			if (!result) throw new Error("Couldn't get data");

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}
}

export const locationDepartmentsController = new LocationDepartmentController(
	"location_departments",
	["locationId", "departmentId", "minCapacity", "maxCapacity"]
);
