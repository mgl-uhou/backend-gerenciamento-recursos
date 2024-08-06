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
	 * @param {string} tableName Table name in the query.
	 * @returns Result of the query.
	 */
	getAll(tableName){
		const sql = `select * from ${tableName} order by id;`;
		return this.exception(sql, [], `Couldn't get ${tableName}.`);
	}

	/**
	 * 
	 * @param {string} tableName Table name in the query.
	 * @param {number} id Id's number of the element.
	 * @returns Result of the query.
	 */
	getById(tableName, id){
		const sql = `select * from ${tableName} where id = ?;`
		return this.exception(sql, [id], `Coudn't get ${tableName}.`)
	}

	/**
	 * TODO: Impedir que usuários comuns mexam com atributos específicos
	 * @param {string} tableName Table name in the query.
	 * @param {Array} columns Table's columns.
	 * @param {Array} values Array of values for the SQL query. 
	 * @returns Result of the query.
	 */
	insertRow(tableName, columns, values){
		const injection = columns.map(() => '?').join(', ');
		const sql = `insert into ${tableName} (${columns.join(', ')}) values (${injection});`;

		return this.exception(sql, values, "Couldn't insert a row into the database.");
	}

	/**
	 * TODO: Impedir que usuários comuns mexam com atributos específicos
	 * @param {string} tableName Table name in the query. 
	 * @param {Array} column Array of columns names.
	 * @param {Array} value Array of values for the SQL query.
	 * @param {number} id Id's number of the element.
	 * @returns 
	 */
	updateRow(tableName, column, value, id){
		const sql = `update ${tableName} set ${column} = ? where id = ?`;
		return this.exception(sql, [value, id], `Couldn't update ${column} in ${tableName}.`);
	}
}

const repository = new Repository();

export default repository;
