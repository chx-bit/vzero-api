import { countriesRouter } from "./routers/countriesRouter.js";
import express from "express";

const app = express();

app.use("/countries", countriesRouter);

app.use(express.static("public"));
app.use("/src", express.static("src"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(3000);

export default app;
