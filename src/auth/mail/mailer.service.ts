import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config'; // Asegúrate de importar esto

@Injectable()
export class MailerService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('MAIL_SERVICE'), // P. ej., 'gmail'
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD')
      }
    });
  }

  async sendPasswordResetMail(email: string, resetToken: string) {
    const resetLink = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`; 

    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'),
      to: email,
      subject: 'Reseteo de Contraseña',
      html: `<p>Haz clic <a href="${resetLink}">aquí</a> para resetear tu contraseña.</p>`
    };

    return this.transporter.sendMail(mailOptions);
  }
}
