import { Request, Response } from 'express';
import GetCustomerAvatarService from '../services/GetCustomerAvatarService';

export default class CustomerAvatarController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getCustomerAvatar = new GetCustomerAvatarService();

    const { avatar_url } = await getCustomerAvatar.execute({
      customer_id: id,
    });

    return response.json({ avatar_url });
  }
}
