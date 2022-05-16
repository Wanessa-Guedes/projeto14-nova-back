import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import homeRouter from "./Routers/homeRouter.js";
import cartRouter from "./Routers/cartRouter.js";
import authRouter from "./Routers/authRouter.js";
import confirmartionRouter from "./Routers/confirmationPageRouter.js";
import headerRouter from "./Routers/headerRouter.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.use(authRouter);
app.use(authRouter);

app.use(homeRouter);
app.use(cartRouter);

app.use(confirmartionRouter);
app.use(confirmartionRouter);

app.use(headerRouter);

app.listen(process.env.PORT, () => {
    console.log(chalk.bold.green(`Back-end on na porta ${process.env.PORT}`))
});