import { Request, Response } from 'express';
import ResetAdminPasswordService from '../services/ResetAdminPasswordService';

export default class ResetAdminPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetAdminPassword = new ResetAdminPasswordService();

    await resetAdminPassword.execute({
      password,
      token,
    });

    return response.status(204).json();
  }
}
