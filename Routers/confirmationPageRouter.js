import { getAddress, postOrder } from "../Controllers/confirmationPageController.js";
import {Router} from "express";
import validateToken from "../Middlewares/tokenMiddleware.js";

const confirmartionRouter = Router();
confirmartionRouter.get("/confirmationpage", getAddress);
confirmartionRouter.post("/confirmationpage", postOrder);

export default confirmartionRouter;