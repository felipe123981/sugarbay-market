import {
  EntityRepository,
  Repository,
} from 'typeorm';
import OrderAddress from '../entities/OrderAddress';

interface ICreateOrderAddress {
  name: string;
  address: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

@EntityRepository(OrderAddress)
export class OrderAddressRepository extends Repository<OrderAddress> {
  public async createAddress({ name, address, city, state, zip, country }: ICreateOrderAddress): Promise<OrderAddress> {
    const orderAddress = this.create({
      name,
      address,
      city,
      state,
      zip,
      country,
    });

    await this.save(orderAddress);

    return orderAddress;
  }
}
