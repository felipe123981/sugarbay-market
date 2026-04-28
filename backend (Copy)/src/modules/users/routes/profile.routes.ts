import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(isAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
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
      recipient_name: Joi.string().optional().allow(null, ''),
      country: Joi.string().optional().allow(null, ''),
      zipcode: Joi.string().optional().allow(null, ''),
      state: Joi.string().optional().allow(null, ''),
      city: Joi.string().optional().allow(null, ''),
      address: Joi.string().optional().allow(null, ''),
      complement: Joi.string().optional().allow(null, ''),
    },
  }),
  profileController.update,
);

export default profileRouter;
