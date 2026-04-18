import { Request, Response } from 'express';
import CreateOrderService from '../services/CreateOrderService';
import ShowOrderService from '../services/ShowOrderService';
import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showOrder = new ShowOrderService();

    const order = await showOrder.execute({ id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { products, shipping_address } = request.body;
    const userId = request.user.id;

    const customersRepository = getCustomRepository(CustomersRepository);

    // Find customer by user_id or email lookup as per documentation
    // Since we only have userId from token, we need to find the user first or use a method that finds customer by userId
    // Let's check CustomersRepository for a findByUserId method or similar.
    // Actually, summary.md says: "Relacionamento User <-> Customer: Relacionamento implícito por email"
    // So I need the user's email first.

    const customer = await customersRepository.createQueryBuilder('customer')
      .innerJoin('users', 'user', 'user.email = customer.email')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!customer) {
      throw new AppError('Customer not found for the authenticated user.');
    }

    const createOrder = new CreateOrderService();

    const order = await createOrder.execute({
      customer_id: customer.id,
      products,
      shipping_address,
    });

    return response.json(order);
  }
}
