import nodemailer from 'nodemailer';

let cachedTransport: nodemailer.Transporter | null = null;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Add it to your .env file.`);
  }
  return value;
}

export function getMailTransport() {
  if (cachedTransport) {
    return cachedTransport;
  }

  const host = requireEnv('SMTP_HOST');
  const port = Number.parseInt(requireEnv('SMTP_PORT'), 10);
  const user = requireEnv('SMTP_USER');
  const pass = requireEnv('SMTP_PASS');

  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransport;
}
