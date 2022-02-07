import { Router } from 'express';

import { verifyToken } from '../middlewares/auth';
import userRoute from './user';

const routes = Router();

routes.use('/users', [verifyToken], userRoute);

export default routes;
