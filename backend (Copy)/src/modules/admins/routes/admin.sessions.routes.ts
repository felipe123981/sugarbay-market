import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import AdminSessionsController from '../controllers/AdminSessionsController';

const adminSessionsRouter = Router();
const adminSessionsController = new AdminSessionsController();

adminSessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  adminSessionsController.create,
);

export default adminSessionsRouter;
