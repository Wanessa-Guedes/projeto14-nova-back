import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import { postSignUp, postSignIn } from "./Controllers/authController.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/signup", postSignUp);
app.post("/signin", postSignIn);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(chalk.bold.green(`Back-end on na porta ${PORT}`))
});