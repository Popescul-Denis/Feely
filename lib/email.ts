import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

//daca suntem in development, folosim localhost, altfel folosim domeniul public
const domain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_BASE_URL;

const transporter = nodemailer.createTransport({ 
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

type EmailOptions = {
  from?: string;
  to: string;
  subject: string;
  html: string;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${domain}/verify-email?token=${token}`;

  const mailOptions: EmailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verificare email',
    html: `<p>Te rugăm să verifici adresa de email făcând click pe link-ul de mai jos:</p>
           <a href="${verificationUrl}">Verifică email-ul</a>
           <p>Dacă nu ai creat un cont, te rugăm să ignori acest email.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export const sendPasswordResetEmail = async (email: string, code: string) => {
  const mailOptions: EmailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Resetare parolă',
    html: `<p>Te rugăm să folosești codul de mai jos pentru a-ți reseta parola:</p>
           <h2>${code}</h2>
           <p>Dacă nu ai cerut resetarea parolei, te rugăm să ignori acest email.</p>`,
  };

  await transporter.sendMail(mailOptions);
}
