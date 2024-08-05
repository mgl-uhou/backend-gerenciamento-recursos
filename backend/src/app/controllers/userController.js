import Controller from "./controller.js";

const employeeController = new Controller("employees", [
	"id", 
	"firstName",
	"lastName",
	"email",
	"password",
	"vacationDays",
	"available",
	"position",
	"isAdmin", 
	"departmentId",
]);

export default employeeController;
