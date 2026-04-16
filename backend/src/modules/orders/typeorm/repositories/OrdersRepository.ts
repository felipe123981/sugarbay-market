import Customer from '@modules/customers/typeorm/entities/Customer';
import {
  EntityRepository,
  Repository,
} from 'typeorm';
import Order from '../entities/Order';

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
  final_price: number;
  seller_id: string;
  buyer_id: string;
}

interface IRequest {
  customer: Customer;
  seller_ids: string[];
  products: IProduct[];
  total: number;
}

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.findOne(id, {
      relations: ['order_products', 'buyer'],
    });
    return order;
  }

  public async createOrder({ customer, seller_ids, products, total }: IRequest): Promise<Order> {
    const order = this.create({
      buyer: customer,
      seller_ids,
      order_products: products,
      total,
    });

    await this.save(order);

    return order;
  }
}
