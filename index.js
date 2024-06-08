import express from "express";
import db from "./DB/ConnectionDB.js";
import customerRouter from "./Src/Modules/Customer/Customer.routes.js";
import carRouter from "./Src/Modules/Car/Car.routes.js";
import rentRouter from "./Src/Modules//Rentals/Rentals.routes.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use("/customer", customerRouter);
app.use("/car", carRouter);
app.use("/rent", rentRouter);

app.use("*", (req, res) => res.send("err"));

app.listen(port, () => console.log(`server listening on port ${port}!`));
