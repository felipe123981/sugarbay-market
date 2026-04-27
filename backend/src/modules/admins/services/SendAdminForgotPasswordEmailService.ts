import { getCustomRepository } from 'typeorm';
import { AdminTokensRepository } from '../typeorm/repositories/AdminTokensRepository';
import { AdminsRepository } from '../typeorm/repositories/AdminsRepository';
import AppError from '@shared/errors/AppError';
import EtherealMail from '@config/mail/EtherealMail';
import path from 'path';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const adminsRepository = getCustomRepository(AdminsRepository);
    const adminTokensRepository = getCustomRepository(AdminTokensRepository);

    const admin = await adminsRepository.findByEmail(email);

    if (!admin) {
      throw new AppError('User does not exists.');
    }

    const { token } = await adminTokensRepository.generate(admin.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await EtherealMail.sendMail({
      to: {
        name: admin.name,
        email: admin.email,
      },
      subject: '[Sugarbay Team] Password reset:',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: admin.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
