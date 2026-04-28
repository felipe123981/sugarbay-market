import { getCustomRepository } from 'typeorm';
import Admin from '../typeorm/entities/Admin';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

interface IRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

class CreateAdminService {
    public async execute({ name, email, password, role }: IRequest): Promise<Admin> {
        const adminRepository = getCustomRepository(AdminsRepository);
        const emailExists = await adminRepository.findByEmail(email);

        if (emailExists) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await hash(password, 8);

        const admin = adminRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await adminRepository.save(admin);

        return admin;
    }
}

export default CreateAdminService;
