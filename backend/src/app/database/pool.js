import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();

class Pool {
	constructor(
		host = process.env.mysql_host || "localhost",
		port = process.env.mysql_port || 3306,
		user = process.env.mysql_user || "root",
		password = process.env.mysql_pass || "",
		database = process.env.mysql_db || "internship_project",
		waitForConnections = true,
		connectionLimit = 10,
		maxIdle = 10,
		idleTimeout = 60000,
		queueLimit = 0,
		enableKeepAlive = true,
		keepAliveInitialDelay = 0
	){
		this.pool = mysql2.createPool({
			host,
			port,
			user, 
			password,
			database,
			waitForConnections,
			connectionLimit,
			maxIdle,
			idleTimeout,
			queueLimit,
			enableKeepAlive,
			keepAliveInitialDelay
		});
	}

	getPool = () => this.pool;

	/**
	 * 
	 * @param {string} sql SQL command string. 
	 * @param {Array} values Array of values for the SQL query.
	 * @param {string} errorMessage Error message (optional).
	 * @returns Result of the query.
	 */
	async connection(sql, values, errorMessage){
		let conn;
		try{
			conn = await this.getPool().promise().getConnection();
			if(!conn) throw new Error("Couldn't get connection.");
			const [ rows ] = await conn.execute(sql, values);
			return rows;
		}catch(e){
			console.error(errorMessage, e);
		}finally{
			conn.release();
		}
	}
}

const pool = new Pool();

export default pool;
