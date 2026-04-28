import { EntityRepository, Repository } from 'typeorm';
import AdminToken from '../entities/AdminToken';

@EntityRepository(AdminToken)
export class AdminTokensRepository extends Repository<AdminToken> {
  public async findByToken(token: string): Promise<AdminToken | undefined> {
    const adminToken = await this.findOne({
      where: {
        token,
      },
    });
    return adminToken;
  }
  public async generate(admin_id: string): Promise<AdminToken> {
    const adminToken = await this.create({
      admin_id,
    });

    await this.save(adminToken);

    return adminToken;
  }
}
