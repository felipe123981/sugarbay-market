import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ForgotAdminPasswordController from '../controllers/ForgotAdminPasswordController';
import ResetAdminPasswordController from '../controllers/ResetAdminPasswordController';

const adminPasswordRouter = Router();
const forgotAdminPasswordController = new ForgotAdminPasswordController();
const resetAdminPasswordController = new ResetAdminPasswordController();

adminPasswordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotAdminPasswordController.create,
);

adminPasswordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')), //
    },
  }),
  resetAdminPasswordController.create,
);
export default adminPasswordRouter;
