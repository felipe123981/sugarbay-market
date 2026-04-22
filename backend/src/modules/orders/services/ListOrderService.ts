import { getCustomRepository } from 'typeorm';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';
import Order from '../typeorm/entities/Order';

interface IRequest {
  customer_id: string;
}

export default class ListOrderService {
  public async execute({ customer_id }: IRequest): Promise<Order[]> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const orders = await ordersRepository.findAllByCustomerId(customer_id);
    return orders;
  }
}
