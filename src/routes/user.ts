import { Router } from 'express';

import UserController from '../controllers/user';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', userController.create);

userRouter.get('/:id', userController.read);

userRouter.get('/', userController.readAll);

userRouter.put('/:id', userController.update);

userRouter.delete('/:id', userController.delete);

export default userRouter;
