import { deleteLogOut } from "../Controllers/headerController.js";
import {Router} from "express";
import validateToken from "../Middlewares/tokenMiddleware.js";

const headerRouter = Router();

headerRouter.delete("/logout", deleteLogOut);

export default headerRouter;