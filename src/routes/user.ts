import { Router } from 'express';

import UserController from '../controllers/user';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', async (req, res, next) => {
  try {
    const response = await userController.create(req.body);

    return res.status(201).send(response);
  } catch (error) {
    return next(error);
  }
});

userRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userController.read(id);

    return res.send(user);
  } catch (error) {
    return next(error);
  }
});

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await userController.readAll();
    return res.send(users);
  } catch (error) {
    return next(error);
  }
});

userRouter.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await userController.update(id, req.body);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
});

userRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await userController.delete(id);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
});

export default userRouter;
