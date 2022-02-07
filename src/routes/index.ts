import { Router } from 'express';

import { verifyToken } from '../middlewares/auth';
import authRoute from './auth';
import userRoute from './user';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/users', [verifyToken], userRoute);

export default routes;
