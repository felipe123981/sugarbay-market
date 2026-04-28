import { getCustomRepository } from 'typeorm';
import Admin from '../typeorm/entities/Admin';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

interface IRequest {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

class UpdateAdminProfileService {
  public async execute({ id, name, email, password, role }: IRequest): Promise<Admin> {
    const adminRepository = getCustomRepository(AdminsRepository);

    const admin = await adminRepository.findOne(id);

    if (!admin) {
      throw new AppError('Admin not found.');
    }

    const adminExists = await adminRepository.findByEmail(email);

    if (adminExists && email != admin.email) {
      throw new AppError('There is already one admin with this email.');
    }

    admin.name = name;
    admin.email = email;
    admin.password = await hash(password, 8);
    admin.role = role;

    await adminRepository.save(admin);

    return admin;
  }
}

export default UpdateAdminProfileService;
