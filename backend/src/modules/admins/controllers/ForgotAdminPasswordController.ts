import { Request, Response } from 'express';
import SendAdminForgotPasswordEmailService from '../services/SendAdminForgotPasswordEmailService';

export default class ForgotAdminPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendAdminForgotPasswordEmail = new SendAdminForgotPasswordEmailService();

    await sendAdminForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}
