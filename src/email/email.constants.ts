import * as process from 'process';

require('dotenv').config();

export const EMAIL_CONFIG = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SERVICE_PROVIDER: 'gmail',
  HOST_PROVIDER: 'smtp.gmail.com',
  PORT_PROVIDER: 587,
};

export const EMAIL_SUBJECT = {
  NEW_REQUEST: 'You received a new request for leave dates',
  APPROVED: 'Leave request approved',
  CANCELED: 'Leave request canceled',
};
