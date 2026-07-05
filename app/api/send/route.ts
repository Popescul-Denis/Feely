import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = 'http://localhost:3000';

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${domain}/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Verificare adresa de email',
    html: `<p>Apasa <a href="${verificationUrl}">aici</a> pentru a-ti verifica adresa de email:</p>`,
  });
}