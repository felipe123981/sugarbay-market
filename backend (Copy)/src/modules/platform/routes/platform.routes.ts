import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import PlatformSettingsController from '../controllers/PlatformSettingsController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';

const platformRouter = Router();
const platformSettingsController = new PlatformSettingsController();

platformRouter.use(isAuthenticated);

platformRouter.get('/settings', platformSettingsController.show);

platformRouter.put(
  '/settings',
  celebrate({
    [Segments.BODY]: {
      tax_rate: Joi.number().required(),
      profit_margin: Joi.number().required(),
      packaging_cost: Joi.number().required(),
      shipping_cost: Joi.number().required(),
    },
  }),
  platformSettingsController.update,
);

export default platformRouter;
