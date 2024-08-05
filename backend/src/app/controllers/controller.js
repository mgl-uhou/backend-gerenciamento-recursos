import repository from "../repositories/repository.js";

class Controller{
	constructor(tableName, columns){
		this._tableName = tableName;
		this._columns = columns;
	}
	getTableName = () => this._tableName;
	getColumns = () => this._columns;

	async index(_req, res){
		try {
			const result = await repository.getAll(this.getTableName());

			if(!result) throw new Error("Couldn't get data");

			res.status(200).json(result);
		} catch (e) {
			res.status(400).json(e);
		}
	}
}

export default Controller;