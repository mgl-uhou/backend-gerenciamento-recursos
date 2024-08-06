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
	
	/**
	 * 
	 * @param {string} tableName Table name for the query.
	 * @returns Result of the query.
	 */
	getAll(tableName){
		const sql = `select * from ${tableName} order by id;`;
		return this.exception(sql, [], `Couldn't get ${tableName}.`);
	}

	/**
	 * 
	 * @param {string} tableName Table name for the query.
	 * @param {number} id Id's value of the element.
	 * @returns Result of the query.
	 */
	getById(tableName, id){
		const sql = `select * from ${tableName} where id = ?;`
		return this.exception(sql, [id], `Coudn't get ${tableName}.`)
	}
}

const repository = new Repository();

export default repository;
