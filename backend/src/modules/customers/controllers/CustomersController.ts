import { Request, Response } from 'express';
import ListCustomerService from '../services/ListCustomerService';
import ShowCustomerService from '../services/ShowCustomerService';
import CreateCustomerService from '../services/CreateCustomerService';
import UpdateCustomerService from '../services/UpdateCustomerService';
import DeleteCustomerService from '../services/DeleteCustomerService';

export default class CustomersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listCustomers = new ListCustomerService();

    const customers = await listCustomers.execute();

    return response.json(customers);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showCustomer = new ShowCustomerService();

    const customer = await showCustomer.execute({ id });

    const { email, ...publicCustomer } = customer;

    return response.json(publicCustomer);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, shop_name, location, bio, rating, reviews_count } = request.body;

    const createCustomer = new CreateCustomerService();

    const customer = await createCustomer.execute({
      name,
      email,
      shop_name,
      location,
      bio,
      rating,
      reviews_count,
    });

    return response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, shop_name, location, bio, rating, reviews_count } = request.body;
    const { id } = request.params;

    const updateCustomer = new UpdateCustomerService();

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
      shop_name,
      location,
      bio,
      rating,
      reviews_count,
    });

    return response.json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteCustomer = new DeleteCustomerService();

    await deleteCustomer.execute({ id });

    return response.json([]);
  }
}
