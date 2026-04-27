import { Request, Response } from 'express';
import ListAdminsService from '../services/ListAdminService';
import ShowAdminProfileService from '../services/ShowAdminProfileService';
import CreateAdminService from '../services/CreateAdminService';
import UpdateAdminProfileService from '../services/UpdateAdminProfileService';
import DeleteAdminService from '../services/DeleteAdminService';
import { instanceToInstance } from 'class-transformer';

export default class AdminsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const ListAdmins = new ListAdminsService();

    const admins = await ListAdmins.execute();

    return response.json(instanceToInstance(admins));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, role } = request.body;

    const createAdmin = new CreateAdminService();

    const admin = await createAdmin.execute({
      name,
      email,
      password,
      role,
    });

    return response.json(instanceToInstance(admin));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showAdmin = new ShowAdminProfileService();

    const admin = await showAdmin.execute({ admin_id: id });

    return response.json(instanceToInstance(admin));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, email, password, role } = request.body;

    const updateAdmin = new UpdateAdminProfileService();

    const admin = await updateAdmin.execute({
      id,
      name,
      email,
      password,
      role,
    });

    return response.json(instanceToInstance(admin));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteAdmin = new DeleteAdminService();

    await deleteAdmin.execute({ id });

    return response.json([]);
  }
}
