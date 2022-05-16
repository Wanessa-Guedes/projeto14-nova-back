import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import homeRouter from "./Routers/homeRouter.js";
import cartRouter from "./Routers/cartRouter.js";

import { postSignUp, postSignIn } from "./Controllers/authController.js";
import {getAddress, postOrder} from "./Controllers/confirmationPageController.js";
import {deleteLogOut} from "./Controllers/headerController.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/signup", postSignUp);
app.post("/signin", postSignIn);

app.use(homeRouter);
app.use(cartRouter);

app.get("/confirmationpage", getAddress);
app.post("/confirmationpage", postOrder);

//Exit
app.delete("/logout", deleteLogOut);

app.listen(process.env.PORT, () => {
    console.log(chalk.bold.green(`Back-end on na porta ${process.env.PORT}`))
});