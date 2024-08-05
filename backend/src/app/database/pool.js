import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();

class Pool {
	constructor(){
		this.pool = mysql2.createPool({});
	}
}

const pool = new Pool();

export default pool;
