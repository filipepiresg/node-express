import * as Sentry from '@sentry/node';
import { Router } from 'express';

import { CreateUser, UpdateUser } from '../@types/user';
import UserController from '../controllers/user';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', async (req, res, next) => {
  try {
    const { email, firstName, password, lastName }: CreateUser = req.body;
    const response = await userController.create({ email, firstName, password, lastName });

    return res.status(201).send(response);
  } catch (error) {
    Sentry.captureException(error);
    return next(error);
  }
});

userRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userController.read(id);

    return res.send(user);
  } catch (error) {
    Sentry.captureException(error);
    return next(error);
  }
});

userRouter.get('/', async (req, res, next) => {
  try {
    const queryLmit = <string>req.query?.per_page;
    const queryPage = <string>req.query?.page;
    const limit = parseInt(queryLmit, 10) || 10;
    const page = parseInt(queryPage, 10) || 1;

    const users = await userController.readAll(limit, page);
    return res.status(users.length ? 200 : 204).send(users);
  } catch (error) {
    Sentry.captureException(error);
    return next(error);
  }
});

userRouter.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName }: UpdateUser = req.body;

    const response = await userController.update(id, { email, firstName, lastName });
    return res.send(response);
  } catch (error) {
    Sentry.captureException(error);
    return next(error);
  }
});

userRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await userController.delete(id);
    return res.send(response);
  } catch (error) {
    Sentry.captureException(error);
    return next(error);
  }
});

export default userRouter;
