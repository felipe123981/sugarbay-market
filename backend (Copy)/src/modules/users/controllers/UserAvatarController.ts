import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import { instanceToInstance } from 'class-transformer';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    if (!request.file) {
      return response.status(400).json({
        status: 'error',
        message: 'No file provided.',
      });
    }

    const updateAvatar = new UpdateUserAvatarService();

    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename as string,
    });

    return response.json(instanceToInstance(user));
  }
}
