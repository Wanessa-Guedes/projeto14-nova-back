import {postItem, getCartItens, deleteItem} from "./../Controllers/cartController.js"
import {Router} from "express";
import validateToken from "../Middlewares/tokenMiddleware.js";

const cartRouter = Router();
cartRouter.post("/cart",validateToken, postItem);
cartRouter.get("/cart", validateToken, getCartItens);
cartRouter.delete("/cart/:id", validateToken, deleteItem);

export default cartRouter;