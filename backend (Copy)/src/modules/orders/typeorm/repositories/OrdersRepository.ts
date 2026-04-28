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
  shipping_address_id: string;
}

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.findOne(id, {
      relations: ['order_products', 'order_products.product', 'buyer', 'shipping_address'],
    });
    return order;
  }

  public async createOrder({ customer, seller_ids, products, total, shipping_address_id }: IRequest): Promise<Order> {
    const order = this.create({
      buyer: customer,
      seller_ids,
      order_products: products,
      total,
      shipping_address_id,
    });

    await this.save(order);

    return order;
  }

  public async findAllByCustomerId(customerId: string): Promise<Order[]> {
    const orders = await this.find({
      where: { buyer_id: customerId },
      relations: ['order_products', 'order_products.product', 'buyer', 'shipping_address'],
      order: { created_at: 'DESC' },
    });
    return orders;
  }
}
