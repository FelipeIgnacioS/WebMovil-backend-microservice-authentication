import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: '',
      auth: {
        user: '',
        pass: ''
      }
    });
  }

  async sendPasswordResetMail(email: string, resetToken: string) {
    const mailOptions = {
      //implementar .env
      from: '',
      to: email,
      subject: '',
      text: ` ${resetToken}`
    };

    return this.transporter.sendMail(mailOptions);
  }
}
