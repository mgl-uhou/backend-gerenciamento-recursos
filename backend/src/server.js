import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.port || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api-docs`));
