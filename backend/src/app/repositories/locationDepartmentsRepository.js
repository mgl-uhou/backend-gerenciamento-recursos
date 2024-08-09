import { Repository } from "./repository.js";

class LocationDepartmentRepository extends Repository{
	/**
	 * 
	 * @param {string} tableName Table name in the query.
	 * @returns Result of the query.
	 */
	getAll(tableName){
		const sql = `select * from ${tableName};`;
		return this.exception(sql, [], `Couldn't get ${tableName}.`);
	}
}

export const locationDepartmentRepository = new LocationDepartmentRepository();