import nodemailer from 'nodemailer';
import {
  emailHost,
  emailPort,
  emailSecure,
  emailUser,
  emailPass,
} from '../constants.js';

const transporter = nodemailer.createTransport({
  host: emailHost, // Coloca el host correspondiente a tu servidor SMTP
  port: emailPort, // Puerto SMTP
  secure: emailSecure, // Si es necesario el uso de SSL o TLS
  auth: {
    user: emailUser, // Coloca el correo desde el que enviarás los correos
    pass: emailPass, // Coloca la contraseña del correo desde el que enviarás los correos
  },
});

export default transporter;
