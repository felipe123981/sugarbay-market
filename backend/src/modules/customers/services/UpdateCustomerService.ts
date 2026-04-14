import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import { CustomersRepository } from '../typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
  name: string;
  email: string;
  shop_name?: string;
  location?: string;
  bio?: string;
  rating?: number;
  reviews_count?: number;
}

class UpdateCustomerService {
  public async execute({ id, name, email, shop_name, location, bio, rating, reviews_count }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const customerExist = await customerRepository.findByEmail(email);

    if (customerExist && email != customer.email) {
      throw new AppError('There is already one customer with this email.');
    }

    customer.name = name;
    customer.email = email;
    if (shop_name !== undefined) customer.shop_name = shop_name;
    if (location !== undefined) customer.location = location;
    if (bio !== undefined) customer.bio = bio;
    if (rating !== undefined) customer.rating = rating;
    if (reviews_count !== undefined) customer.reviews_count = reviews_count;

    await customerRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
