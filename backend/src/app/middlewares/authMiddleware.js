import jwt from "jsonwebtoken";
import repository from "../repositories/repository.js";

export const authMiddleware = async (req, res, next) => {
		try {
			const { authorization } = req.headers;
			
			if(!authorization) throw new Error("Unauthorized.");

			const token = authorization.split(" ")[1];

			const { id } = jwt.verify(token, process.env.jwt_pass);

			const users = await repository.getAll('employees');
			let user;
			for(let u of users)
				if(u.id === id)
					user = u;

			if(!user) throw new Error("Unauthorized.");

			const { password: _, ...loggedUser} = user;

			req.employee = loggedUser;

			next();
		} catch (e) {
			res.status(401).json({ error: e.message });			
		}	
}