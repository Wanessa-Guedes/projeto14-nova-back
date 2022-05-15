import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import {registerProducts, getProducts} from "./Controllers/homeController.js";
import { postSignUp, postSignIn } from "./Controllers/authController.js";
import { postItem, getCartItens, deleteItem } from "./Controllers/cartController.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/signup", postSignUp);
app.post("/signin", postSignIn);

app.post("/home", registerProducts);
app.get("/home", getProducts);

app.post("/cart", postItem);
app.get("/cart", getCartItens);
app.delete("/cart", deleteItem)


app.listen(process.env.PORT, () => {
    console.log(chalk.bold.green("Back-end on na porta"))
});