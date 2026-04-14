import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import { CustomersRepository } from '../typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  email: string;
  shop_name?: string;
  location?: string;
  bio?: string;
  rating?: number;
  reviews_count?: number;
}

class CreateCustomerService {
  public async execute({ name, email, shop_name, location, bio, rating, reviews_count }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const emailExists = await customersRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError('Email address is already used.');
    }

    const customer = customersRepository.create({
      name,
      email,
      shop_name,
      location,
      bio,
      rating,
      reviews_count,
    });

    await customersRepository.save(customer);

    return customer;
  }
}

export default CreateCustomerService;
