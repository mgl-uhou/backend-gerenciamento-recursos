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

	/**
	 * 
	 * @param {string} tableName The table name, by convention.
	 * @param {number} locationId Id of the location. 
	 * @param {number} departmentId Id of the department. 
	 * @returns Result of the query in JSON.
	 */
	getById(tableName, locationId, departmentId){
		const sql = `select * from ${tableName} where locationId = ? and departmentId = ?;`;
		return this.exception(sql, [ locationId, departmentId ], `Couldn't get ${tableName}.`);
	}

	/**
	 * 
	 * @param {string} tableName Table name, by convention.
	 * @param {number} locationId Id of the location.
	 * @param {number} departmentId Id of the department.
	 * @param {string} column Column name.
	 * @param {string} value Value of the column.
	 * @returns Return of the query in JSON.
	 */
	updateRow(tableName, locationId, departmentId, column, value){
		const sql = `update ${tableName} set ${column} = ? where locationId = ? and departmentId = ?;`;
		return this.exception(sql, [ value, locationId, departmentId ], `Couldn't update ${tableName}.`);
	}

	/**
	 * 
	 * @param {string} tableName Table name, by convention.
	 * @param {number} locationId Id of the location.
	 * @param {number} departmentId Id of the department.
	 * @returns Return of the query in JSON.
	 */
	deleteById(tableName, locationId, departmentId){
		const sql = `delete from ${tableName} where locationId = ? and departmentId = ?;`;
		return this.exception(sql, [ locationId, departmentId ], `Couldn't delete record of ${tableName}.`);
	}
}

export const locationDepartmentRepository = new LocationDepartmentRepository();