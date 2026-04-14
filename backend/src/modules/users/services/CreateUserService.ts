import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import { UsersRepository } from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

interface IRequest {
  name: string;
  email: string;
  password: string;
  recipient_name?: string;
  country?: string;
  zipcode?: string;
  state?: string;
  city?: string;
  address?: string;
  complement?: string;
}

class CreateUserService {
  public async execute({ name, email, password, recipient_name, country, zipcode, state, city, address, complement }: IRequest): Promise<User> {
    const userRepository = getCustomRepository(UsersRepository);
    const nameExists = await userRepository.findByName(name);
    const emailExists = await userRepository.findByEmail(email);

    if(nameExists) {
      throw new AppError('There is already one other user with this name.')
    }

    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
      recipient_name,
      country,
      zipcode,
      state,
      city,
      address,
      complement,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
