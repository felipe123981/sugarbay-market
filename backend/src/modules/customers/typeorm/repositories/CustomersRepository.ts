import { EntityRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

@EntityRepository(Customer)
export class CustomersRepository extends Repository<Customer> {
  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.findOne({
      where: {
        id,
      },
    });
    return customer;
  }
  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.findOne({
      where: {
        email,
      },
    });
    return customer;
  }

  public async findOrCreateByEmail(userData: { name: string, email: string }): Promise<Customer> {
    let customer = await this.findByEmail(userData.email);

    if (!customer) {
      customer = this.create({
        name: userData.name,
        email: userData.email,
      });

      await this.save(customer);
    }

    return customer;
  }
}
