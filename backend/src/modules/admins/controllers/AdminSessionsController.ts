import { Request, Response } from 'express';
import CreateAdminSessionsService from '../services/CreateAdminSessionsService';
import { instanceToInstance } from 'class-transformer';
export default class AdminSessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = new CreateAdminSessionsService();

    const admin = await createSession.execute({
      email,
      password,
    });

    const { method, url, ip } = request;
    console.log(
      `[+] Admin Session Required: \n  =>at: [${new Date().toISOString()}]\n  =>method: ${method}\n  =>url: ${url}\n  =>email: ${email}\n  =>from ${ip}`,
    );

    return response.json(instanceToInstance(admin));
  }
}
