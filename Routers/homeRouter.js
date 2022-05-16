import {registerProducts, getProducts} from "./../Controllers/homeController.js";
import {Router} from "express";

const homeRouter = Router();
homeRouter.post("/home", registerProducts);
homeRouter.get("/home", getProducts);

export default homeRouter;