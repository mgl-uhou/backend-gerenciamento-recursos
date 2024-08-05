import pool from "../database/pool.js";

class Repository{
	/**
	 * 
	 * @param {string} sql SQL command string. 
	 * @param {Array} values Array of values for the SQL query.
	 * @param {*} errorMessage Error message (optional).
	 * @returns Result of the query.
	 */
	async exception(sql, values = [], errorMessage){
		try {
			const result = await pool.connection(sql, values, errorMessage);
			return result;
		} catch (e) {
			console.error(errorMessage, e);
			return e;
		}
	}

	getAll(tableName){
		const sql = `select * from ${tableName} order by id;`;
		return this.exception(sql, [], `Couldn't get ${tableName}`);
	}
}

const repository = new Repository();

export default repository;
