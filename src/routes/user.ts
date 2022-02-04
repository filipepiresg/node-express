import { Router } from "express";
import UserController from "../controllers/user";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/:id", userController.getUser);

userRouter.get("/", userController.getUsers);

export default userRouter;
