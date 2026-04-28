import { getCustomRepository } from 'typeorm';
import Admin from '../typeorm/entities/Admin';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  admin_id: string;
}

class ShowAdminProfileService {
  public async execute({ admin_id }: IRequest): Promise<Admin> {
    const adminRepository = getCustomRepository(AdminsRepository);

    const admin = await adminRepository.findById(admin_id);

    if (!admin) {
      throw new AppError('User not found.');
    }

    return admin;
  }
}

export default ShowAdminProfileService;
