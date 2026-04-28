import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import OrdersController from '../controllers/OrdersController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.use(isAuthenticated);

ordersRouter.get('/profile/orders', ordersController.index);

// Rota administrativa — descomentar quando implementar controle de admin
// ordersRouter.get('/admin', isAuthenticated, ensureAdmin, ordersController.listAll);

ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ordersController.show,
);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      products: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().uuid().required(),
            quantity: Joi.number().integer().min(1).required(),
          }),
        )
        .required(),
      shipping_address: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().allow(null, ''),
        zip: Joi.string().required(),
        country: Joi.string().required(),
      }).required(),
    },
  }),
  ordersController.create,
);

export default ordersRouter;
