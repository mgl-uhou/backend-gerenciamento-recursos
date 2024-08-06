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
			if (!result)
				throw new Error(
					`Couldn't insert data into ${this.getTableName()}`
				);

			res.status(201).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}

	async update(req, res) {
		try {
			const id = req.params.id;
			const element = await repository.getById(this.getTableName(), id);
			// console.log(element);
			if (!element.length)
				return res.status(404).json({ message: "Record not found" });

			const columns = Object.keys(req.body);
			const values = Object.values(req.body);
			const error = {};
			const success = {};

			for (const [index, column] of columns.entries()) {
				// column is the value
				try {
					const result = await repository.updateRow(
						this.getTableName(),
						column,
						values[index],
						id
					);
					console.log(result);
					
					if (!result) throw new Error(`Could't update ${column}`);
					success[column] = result;
				} catch (e) {
					error[column] = e.message;
				}
			}
			res.json({ success, error });
		} catch (e) {
			res.status(500).json({ message: "Error updating record", e });
		}
	}
}

export default Controller;
