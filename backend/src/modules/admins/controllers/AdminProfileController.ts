import { Request, Response } from 'express';
import ShowAdminProfileService from '../services/ShowAdminProfileService';
import UpdateAdminProfileService from '../services/UpdateAdminProfileService';
import { instanceToInstance } from 'class-transformer';
export default class AdminProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showProfileService = new ShowAdminProfileService();
    const admin_id = request.admin.id;

    const admin = await showProfileService.execute({
      admin_id,
    });

    return response.json(instanceToInstance(admin));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const admin_id = request.admin.id;
    const { name, email, password, old_password, role } = request.body;

    const updateProfile = new UpdateAdminProfileService();

    const admin = await updateProfile.execute({
      admin_id,
      name,
      email,
      password,
      old_password,
      role,
    });

    return response.json(instanceToInstance(admin));
  }
}
