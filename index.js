import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import { postSignUp, postSignIn} from "./Controllers/authController.js";
import {getAddress} from "./Controllers/confirmationPageController.js";
import {registerProducts, getProducts} from "./Controllers/homeController.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/signup", postSignUp);
app.post("/signin", postSignIn);
app.get("/confirmationpage", getAddress);

//para a router de produtos
app.post("/home", registerProducts);
app.get("/home", getProducts);

app.listen(process.env.PORT, () => {
    console.log(chalk.bold.green("Back-end on na porta"))
});