import { getCustomRepository } from 'typeorm';
import Admin from '../typeorm/entities/Admin';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { AdminTokensRepository } from '../typeorm/repositories/AdminTokensRepository'

interface IRequest {
  email: string;
  password: string;
}
interface IResponse {
  admin: Admin;
  token: string;
}

class CreateAdminSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const adminRepository = getCustomRepository(AdminsRepository);
    const adminTokensRepository = getCustomRepository(AdminTokensRepository);
    const admin = await adminRepository.findByEmail(email);

    if (!admin) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordConfirmed = await compare(password, admin.password);

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const token = sign({}, authConfig.jwt.admin_secret, {
      subject: admin.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    await adminTokensRepository.generate(admin.id);

    return { admin, token };
  }
}

export default CreateAdminSessionsService;
