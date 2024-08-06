import repository from "../repositories/repository.js";

class Controller {
	constructor(tableName, columns) {
		this._tableName = tableName;
		this._columns = columns;
	}
	getTableName = () => this._tableName;
	getColumns = () => this._columns;

	async index(_req, res) {
		try {
			const result = await repository.getAll(this.getTableName());
			if (!result) throw new Error("Couldn't get data");

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}

	async show(req, res) {
		try {
			const result = await repository.getById(
				this.getTableName(),
				req.params.id
			);
			if (!result) throw new Error("Couldn't get data");

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}

	async store(req, res) {
		try {
			const result = await repository.insertRow(
				this.getTableName(),
				this.getColumns(),
				Object.values(req.body)
			);
			if(!result) throw new Error (`Couldn't insert data into ${this.getTableName()}`);

			res.status(201).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}
}

export default Controller;
