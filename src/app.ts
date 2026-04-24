
import express from "express";
import userRoutes from "./routes/user";
import loginRoutes from "./routes/login";
import cors from 'cors';
import corsOptions from "./config/cors";

const app = express();
app.use(cors(corsOptions));

app.use((req, _res, next) => {
	console.log(`[${req.method}] url:: ${req.url}`);
	next();
});


app.use("/users", userRoutes);
app.use("/login", loginRoutes);


export default app;