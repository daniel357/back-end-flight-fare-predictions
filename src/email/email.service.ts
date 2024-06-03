import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import { EMAIL_CONFIG } from './email.constants';
import Mail from 'nodemailer/lib/mailer';
import { EmailDto } from './email.dto';
import * as fs from 'fs';
import { formatDateToHumanReadable } from '../common/utils/date-utils';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: EMAIL_CONFIG.SERVICE_PROVIDER,
      host: EMAIL_CONFIG.HOST_PROVIDER,
      port: EMAIL_CONFIG.PORT_PROVIDER,
      secure: false,
      auth: {
        user: EMAIL_CONFIG.ADMIN_EMAIL,
        pass: EMAIL_CONFIG.ADMIN_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  async renderTemplate(templatePath: string, data: Object): Promise<string> {
    return new Promise((resolve, reject) => {
      ejs.renderFile(templatePath, data, {}, (err, str) => {
        if (err) {
          reject(
            new HttpException(
              'Template rendering failed',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        } else {
          resolve(str);
        }
      });
    });
  }

  async notifyThroughMail(mailInformation: EmailDto) {
    const {
      flightDate,
      departureHour,
      departureMinute,
      predictedDays,
      toEmail,
    } = mailInformation;
    try {
      const parsedFlightDate = new Date(flightDate);
      const formattedStartDate = formatDateToHumanReadable(parsedFlightDate);

      const dayToBuy = new Date(flightDate);
      dayToBuy.setDate(dayToBuy.getDate() - predictedDays);
      const formattedDayToBuy = formatDateToHumanReadable(dayToBuy);

      const templatePath = path.join(
        __dirname,
        'mailTemplates',
        'mailTemplate.ejs',
      );
      const cssPath = path.join(__dirname, 'mailTemplates', 'mailStyles.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      const htmlContent = await this.renderTemplate(templatePath, {
        formattedStartDate: formattedStartDate,
        formattedDayToBuy: formattedDayToBuy,
        departureHour: departureHour,
        departureMinute: departureMinute,
        cssContent: cssContent,
        predictedDays: predictedDays,
      });

      await this.sendMail({
        from: EMAIL_CONFIG.ADMIN_EMAIL,
        to: toEmail,
        subject: 'Best Flight Fare Deals',
        html: htmlContent,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to send notification email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendMail(mailOptions: Mail.Options) {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
