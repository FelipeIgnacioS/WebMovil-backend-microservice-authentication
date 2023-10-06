import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
      }
    });
  }

  async sendPasswordResetMail(email: string, resetToken: string) {
    const mailOptions = {
      from: 'youremail@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Use this token to reset your password: ${resetToken}`
    };

    return this.transporter.sendMail(mailOptions);
  }
}
