import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import AdminProfileController from '../controllers/AdminProfileController';
import ensureAdmin from '@shared/http/middlewares/ensureAdmin';

const adminProfileRouter = Router();
const adminProfileController = new AdminProfileController();

adminProfileRouter.use(ensureAdmin);

adminProfileRouter.get('/', adminProfileController.show);

adminProfileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string().optional(),
      password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', {
          is: Joi.exist(),
          then: Joi.required(),
        }),
      role: Joi.string().optional().allow(null, ''),
    },
  }),
  adminProfileController.update,
);

export default adminProfileRouter;
