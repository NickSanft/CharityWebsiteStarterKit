import nodemailer from 'nodemailer';

function createTransport() {
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }

  console.warn('No email provider configured — emails will be logged to console');
  return null;
}

const transporter = createTransport();

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  const fromAddress = from || process.env.SMTP_USER || 'noreply@example.com';

  if (!transporter) {
    console.log(`[Email] To: ${to}, Subject: ${subject}`);
    console.log(`[Email] Body: ${html}`);
    return;
  }

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html,
  });
}
