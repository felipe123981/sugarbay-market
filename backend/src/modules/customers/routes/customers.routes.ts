import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import CustomersController from '../controllers/CustomersController';
import CustomerAvatarController from '../controllers/CustomerAvatarController';

const customersRouter = Router();

//customersRouter.use(isAuthenticated);
const customersController = new CustomersController();
const customerAvatarController = new CustomerAvatarController();

customersRouter.get('/', customersController.index);

customersRouter.get(
  '/avatar/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customerAvatarController.show,
);

customersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customersController.show,
);

customersRouter.post(
  '/',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      shop_name: Joi.string().optional().allow(null, ''),
      location: Joi.string().optional().allow(null, ''),
      bio: Joi.string().optional().allow(null, ''),
      rating: Joi.number().optional(),
      reviews_count: Joi.number().optional(),
    },
  }),
  customersController.create,
);

customersRouter.put(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      shop_name: Joi.string().optional().allow(null, ''),
      location: Joi.string().optional().allow(null, ''),
      bio: Joi.string().optional().allow(null, ''),
      rating: Joi.number().optional(),
      reviews_count: Joi.number().optional(),
    },
  }),
  customersController.update,
);

customersRouter.delete(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customersController.delete,
);

export default customersRouter;
