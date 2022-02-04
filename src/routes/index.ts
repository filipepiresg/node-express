import { Router } from "express";

import userRoute from "./user";

const routes = Router();

routes.use("/users", userRoute);

export default routes;
