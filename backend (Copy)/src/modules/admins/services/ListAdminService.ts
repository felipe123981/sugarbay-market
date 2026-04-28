import { getCustomRepository } from 'typeorm';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import Admin from '../typeorm/entities/Admin';

class ListAdminService {
  public async execute(): Promise<Admin[]> {
    const adminRepository = getCustomRepository(AdminsRepository);

    const admin = adminRepository.find();

    return admin;
  }
}

export default ListAdminService;
