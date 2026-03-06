import { countriesRouter } from "./routers/countriesRouter.js";
import express from "express";
const app = express();

app.use("/countries", countriesRouter);

app.use(express.static("public"));
app.use("/src", express.static("src"));

app.listen(3000, () => {
    console.log("running on port 3000");
});
