import { getCustomRepository } from 'typeorm';
import Admin from '../typeorm/entities/Admin';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';

interface IRequest {
  admin_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
  role?: string;
}

class UpdateProfileService {
  public async execute({
    admin_id,
    name,
    email,
    password,
    old_password,
    role
  }: IRequest): Promise<Admin> {
    const adminRepository = getCustomRepository(AdminsRepository);

    const admin = await adminRepository.findById(admin_id);

    if (!admin) {
      throw new AppError('Admin not found.');
    }

    const adminUpdateEmail = await adminRepository.findByEmail(email);

    if (adminUpdateEmail && adminUpdateEmail.id != admin.id) {
      throw new AppError('There is already one admin with this email.')
    }

    if (password && !old_password) {
      throw new AppError('Old password is required.')
    }

    if (password && old_password) {
      const checkPassword = await compare(old_password, admin.password);

      if (!checkPassword) {
        throw new AppError('Old password does not match.');
      }

      admin.password = await hash(password, 8)
    }

    admin.name = name;
    admin.email = email;

    if (role !== undefined) admin.role = role;

    await adminRepository.save(admin);

    return admin;
  }
}

export default UpdateProfileService;
