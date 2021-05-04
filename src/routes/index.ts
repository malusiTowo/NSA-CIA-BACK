import { Router } from 'express';
import auth from './auth';
import user from './user';
import inventory from "./inventory";

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/inventory', inventory);

export default routes;
