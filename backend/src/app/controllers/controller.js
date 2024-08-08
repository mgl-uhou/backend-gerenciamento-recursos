import repository from "../repositories/repository.js";

class Controller {
	constructor(tableName, columns) {
		this._tableName = tableName;
		// this._columns = columns;
	}
	getTableName = () => this._tableName;
	// getColumns = () => this._columns;

	unauthorized = res => res.status(401).json({ error: "Unauthorized." });
	async index(req, res) {
		try {
			if(!req.employee.isAdmin) return this.unauthorized(res);
			const result = await repository.getAll(this.getTableName());
			if (!result) throw new Error("Couldn't get data");

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}

	async show(req, res) {
		try {
			if(!req.employee.isAdmin) return this.unauthorized(res);
			const result = await repository.getById(
				this.getTableName(),
				req.params.id
			);
			if (!result) throw new Error("Couldn't get data");

			if(result.length === 0) 
				return res.status(404).json({ message: "Record not exists" });

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}

	async store(req, res) {
		try {
			if(!req.employee.isAdmin) return this.unauthorized(res);
			const result = await repository.insertRow(
				this.getTableName(),
				Object.keys(req.body),
				Object.values(req.body)
			);
			if (!result)
				throw new Error(
					`Couldn't insert data into ${this.getTableName()}`
				);

			res.status(201).json(result);
		} catch (e) {
			console.log(e);
			res.status(400).json({ error: e.message });
		}
	}

	async update(req, res) {
		try {
			if(!req.employee.isAdmin) return this.unauthorized(res);
			const id = req.params.id;
			const element = await repository.getById(this.getTableName(), id);
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
					
					if (!result) throw new Error(`Could't update ${column}`);
					success[column] = result;
				} catch (e) {
					error[column] = e.message;
				}
			}
			res.json({ success, error });
		} catch (e) {
			res.status(500).json({ error: "Error updating record", e });
		}
	}

	async delete(req, res){
		try {
			if(!req.employee.isAdmin) return this.unauthorized(res);
			const result = await repository.deleteById(this.getTableName(), req.params.id);
			if(!result) throw new Error("Couldn't delete data.");

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json({ error: e.message })
		}
	}
}

export default Controller;
