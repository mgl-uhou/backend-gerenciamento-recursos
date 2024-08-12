import mysql2 from "mysql2";
import bcrypt from "bcrypt";
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
  ) {
    this.database = database;
    this.pool = null;

    // Initialize database
    this.initializeDatabase({
      host,
      port,
      user,
      password,
      waitForConnections,
      connectionLimit,
      maxIdle,
      idleTimeout,
      queueLimit,
      enableKeepAlive,
      keepAliveInitialDelay,
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
  async connection(sql, values, errorMessage) {
    let conn;
    try {
      conn = await this.getPool().promise().getConnection();
      if (!conn) throw new Error("Couldn't get connection.");
      const [rows] = await conn.execute(sql, values);
      return rows;
    } catch (e) {
      console.error(errorMessage, e);
    } finally {
      if (conn) conn.release();
    }
  }

  // Method to initialize the database and tables
  async initializeDatabase(connectionConfig) {
    const password = await bcrypt.hash(process.env.admin_pass, 10);
    const sqlCommands = [
      `CREATE DATABASE IF NOT EXISTS ${this.database}
        DEFAULT CHARACTER SET utf8mb4
        DEFAULT COLLATE utf8mb4_unicode_ci;`,
      `USE ${this.database};`,
      `CREATE TABLE IF NOT EXISTS locations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(255)
      );`,
      `CREATE TABLE IF NOT EXISTS departments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS location_departments (
        locationId INT NOT NULL,
        departmentId INT NOT NULL,
        minCapacity INT NOT NULL,
        maxCapacity INT NOT NULL,
        FOREIGN KEY (locationId) REFERENCES locations(id),
        FOREIGN KEY (departmentId) REFERENCES departments(id),
        PRIMARY KEY (locationId, departmentId),
        CHECK (minCapacity >= 0 AND maxCapacity >= minCapacity)
      );`,
      `CREATE TABLE IF NOT EXISTS assignments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        startDate DATE,
        endDate DATE,
        locationId INT NOT NULL,
        departmentId INT NOT NULL,
        FOREIGN KEY (locationId, departmentId) REFERENCES location_departments(locationId, departmentId),
        CHECK (startDate < endDate)
      );`,
      `CREATE TABLE IF NOT EXISTS employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        birthDate DATE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        vacationStart DATE,
        vacationEnd DATE,
        available BOOLEAN DEFAULT TRUE,
        isAdmin BOOLEAN DEFAULT FALSE,
        assignmentId INT,
        FOREIGN KEY (assignmentId) REFERENCES assignments(id)
      );`,
      `INSERT INTO employees (firstName, lastName, email, password, isAdmin)
      SELECT 'Admin', 'Admin', '${process.env.admin_email}', '${password}', 1
      WHERE NOT EXISTS (
        SELECT 1 FROM employees WHERE email = '${process.env.admin_email}'
      );`,
    ];

    // Create initial pool without specifying the database
    const initialPool = mysql2.createPool({ ...connectionConfig });

    let conn;
    try {
      conn = await initialPool.promise().getConnection();
      for (let sql of sqlCommands) {
        await conn.query(sql);
      }
      console.log("Database and tables initialized successfully.");
    } catch (e) {
      console.error("Error initializing database and tables:", e);
    } finally {
      if (conn) conn.release();
      // Close initial pool
      initialPool.end();

      // Create the pool with the database specified
      this.pool = mysql2.createPool({
        ...connectionConfig,
        database: this.database,
      });
    }
  }
}

const pool = new Pool();

export default pool;
