import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  private transporter;
  private mailConfig; // Define tus configuraciones de correo aquí

  constructor() {
    this.mailConfig = {
      //configuralo usando variables de entorno
      host: process.env.SMTP_HOST, 
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    this.transporter = nodemailer.createTransport(this.mailConfig);
  }

  async sendPasswordResetMail(email: string, token: string): Promise<void> {
    const mailOptions = {
      from: '"Support Team" <support@example.com>', // dirección del remitente
      to: email, // lista de destinatarios
      subject: 'Password Reset', // línea de asunto
      html: `<p>Para restablecer su contraseña, use el siguiente código: ${token}</p>`, // cuerpo del correo electrónico
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo de restablecimiento de contraseña enviado a ${email}`);
    } catch (error) {
      console.error('Error al enviar el correo', error);
      throw error;
    }
  }

}
