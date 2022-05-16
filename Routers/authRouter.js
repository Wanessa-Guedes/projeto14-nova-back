
import {postSignUp, postSignIn} from "./../Controllers/authController.js"
import {Router} from "express";
import validateToken from "../Middlewares/tokenMiddleware.js";

const authRouter = Router();
authRouter.post("/signup", postSignUp);
authRouter.post("/signin", postSignIn);

export default authRouter;