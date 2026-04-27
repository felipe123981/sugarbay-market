import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import AdminsController from '../controllers/AdminsController';
import ensureAdmin from '@shared/http/middlewares/ensureAdmin';

const adminsRouter = Router();
const adminsController = new AdminsController();

const upload = multer(uploadConfig);

adminsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    },
  }),
  adminsController.create,
);

export default adminsRouter;
