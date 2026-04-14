import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '../typeorm/repositories/CustomersRepository';
import { UsersRepository } from '../../users/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  customer_id: string;
}

class GetCustomerAvatarService {
  public async execute({ customer_id }: IRequest): Promise<{ avatar_url: string | null }> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const usersRepository = getCustomRepository(UsersRepository);

    const customer = await customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const user = await usersRepository.findByEmail(customer.email);

    if (!user || !user.avatar) {
      return { avatar_url: null };
    }

    const avatarUrl = `${process.env.APP_API_URL}/files/${user.avatar}`;

    return { avatar_url: avatarUrl };
  }
}

export default GetCustomerAvatarService;
