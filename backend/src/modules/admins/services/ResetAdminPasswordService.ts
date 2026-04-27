import { getCustomRepository } from 'typeorm';
import { AdminTokensRepository } from '../typeorm/repositories/AdminTokensRepository';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import AppError from '@shared/errors/AppError';
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';

interface IRequest {
  password: string;
  token: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const adminsRepository = getCustomRepository(AdminsRepository);
    const adminTokensRepository = getCustomRepository(AdminTokensRepository);

    const adminToken = await adminTokensRepository.findByToken(token);

    if (!adminToken) {
      throw new AppError('Admin Token does not exists.');
    }

    const admin = await adminsRepository.findById(adminToken.admin_id);

    if (!admin) {
      throw new AppError('User does not exists.');
    }

    const tokenCreatedAt = adminToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    admin.password = await hash(password, 8);

    await adminsRepository.save(admin);
  }
}

export default ResetPasswordService;
