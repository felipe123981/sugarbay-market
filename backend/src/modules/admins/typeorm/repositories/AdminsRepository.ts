import { Repository, EntityRepository } from "typeorm";
import Admin from "../entities/Admin";

@EntityRepository(Admin)
export class AdminsRepository extends Repository<Admin> {
    public async findById(id: string): Promise<Admin | undefined> {
        const admin = this.findOne({
            where: {
                id,
            },
        });
        return admin;
    }

    public async findByEmail(email: string): Promise<Admin | undefined> {
        const admin = this.findOne({
            where: {
                email,
            },
        });
        return admin;
    }
}

export default AdminsRepository;