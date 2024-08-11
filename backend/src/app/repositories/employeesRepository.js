import { Repository } from "./repository.js";

class EmployeesRepository extends Repository {
	getAssignments(id){
		const sql = `
			select 
				concat(e.firstName, " ", e.lastName) Nome, 
				e.email "E-mail",
				a.startDate "Início",
				a.endDate Fim,
				d.name Departamento,
				concat_ws(" - ", l.name, l.address) "Localização"
			from employees e
			join assignments a on a.id =  e.assignmentId
			join departments d on d.id = a.departmentId
			join locations l on l.id = a.locationId
			where e.id = ?;
		`;

		return this.exception(sql, [ id ], "Couldn't get assignments.");
	}
}

export const employeesRepository = new EmployeesRepository();
