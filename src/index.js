import { countriesRouter } from "./routers/countriesRouter.js";
import express from "express";

const app = express();

// Middleware API
app.use("/countries", countriesRouter);

// app.listen(3000);
// app.use("/src", express.static("src"));

export default app;
