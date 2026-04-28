import { getCustomRepository } from 'typeorm';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

class DeleteAdminService {
  public async execute({ id }: IRequest): Promise<void> {
    const adminRepository = getCustomRepository(AdminsRepository);

    const admin = await adminRepository.findOne(id);

    if (!admin) {
      throw new AppError('User not found.');
    }

    await adminRepository.remove(admin);
  }
}

export default DeleteAdminService;
