
import express from "express";
import userRoutes from "./routes/user";
import loginRoutes from "./routes/login";
import orderRoutes from "./routes/order";
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
app.use("/orders", orderRoutes);


export default app;