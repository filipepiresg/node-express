import { Request, Response, Router } from 'express';

import AuthController from '../controllers/auth';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;
    const response = await authController.login({ email, password });

    return res.send(response);
  } catch (error) {
    return next(error);
  }
});

authRouter.get('/renewToken', async (req, res, next) => {
  try {
    const token = <string>req.headers['x-access-token'];
    const response = await authController.renewToken(token);

    return res.send(response);
  } catch (error) {
    return next(error);
  }
});

export default authRouter;
