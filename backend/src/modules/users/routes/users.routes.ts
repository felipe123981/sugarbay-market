import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      recipient_name: Joi.string().optional().allow(null, ''),
      country: Joi.string().optional().allow(null, ''),
      zipcode: Joi.string().optional().allow(null, ''),
      state: Joi.string().optional().allow(null, ''),
      city: Joi.string().optional().allow(null, ''),
      address: Joi.string().optional().allow(null, ''),
      complement: Joi.string().optional().allow(null, ''),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);
export default usersRouter;
/**
 

usersRouter.get('/', isAuthenticated, usersController.index);
usersRouter.get('/:id', usersController.show);

usersRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.update,
);
usersRouter.delete('/:id', usersController.delete);

*/
