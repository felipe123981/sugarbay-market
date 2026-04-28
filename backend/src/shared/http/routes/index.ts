import customersRouter from '@modules/customers/routes/customers.routes';
import ordersRouter from '@modules/orders/routes/orders.routes';
import platformRouter from '@modules/platform/routes/platform.routes';
import productsRouter from '@modules/products/routes/products.routes';
import reviewsRouter from '@modules/reviews/routes/reviews.routes';
import passwordRouter from '@modules/users/routes/password.routes';
import profileRouter from '@modules/users/routes/profile.routes';
import sessionsRouter from '@modules/users/routes/sessions.routes';
import usersRouter from '@modules/users/routes/users.routes';
import adminsRouter from '@modules/admins/routes/admins.routes';
import adminSessionsRouter from '@modules/admins/routes/admin.sessions.routes';
import { Router } from 'express';
import adminPasswordRouter from '@modules/admins/routes/password.routes';
import adminProfileRouter from '@modules/admins/routes/profile.routes';

const routes = Router();

routes.use('/products', productsRouter);

routes.use('/users', usersRouter);

routes.use('/sessions', sessionsRouter);

routes.use('/password', passwordRouter);

routes.use('/profile', profileRouter);

routes.use('/customers', customersRouter);

routes.use('/orders', ordersRouter);

routes.use('/reviews', reviewsRouter);

routes.use('/platform', platformRouter);

routes.use('/admin/sessions', adminSessionsRouter);

routes.use('/admin/password', adminPasswordRouter);

routes.use('/admin/profile', adminProfileRouter);

routes.use('/admin', adminsRouter);

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello dev!' });
});

export default routes;
