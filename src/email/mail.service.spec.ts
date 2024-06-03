import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './email.service';
import * as nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from './email.constants';
import { EmailDto } from './email.dto';
import * as fs from 'fs';
import { formatDateToHumanReadable } from '../common/utils/date-utils';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';

jest.mock('nodemailer');
jest.mock('fs');
jest.mock('../common/utils/date-utils', () => ({
  formatDateToHumanReadable: jest.fn(),
}));

describe('MailService', () => {
  let service: MailService;
  let transporterMock;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn().mockResolvedValue(true),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('notifyThroughMail', () => {
    it('should send an email with the correct content', async () => {
      const mailInformation: EmailDto = {
        toEmail: 'daniel.znaceni@gmail.com',
        flightDate: '2022-07-15',
        predictedDays: 30,
        departureHour: 14,
        departureMinute: 30,
      };

      const parsedFlightDate = new Date(mailInformation.flightDate);
      (formatDateToHumanReadable as jest.Mock)
        .mockReturnValueOnce('July 15, 2022')
        .mockReturnValueOnce('June 15, 2022');

      const cssContent = 'css content';
      (fs.readFileSync as jest.Mock).mockReturnValue(cssContent);

      const templatePath = path.join(
        __dirname,
        'mailTemplates',
        'mailTemplate.ejs',
      );

      const cssPath = path.join(__dirname, 'mailTemplates', 'mailStyles.css');

      const renderTemplateMock = jest
        .spyOn(service, 'renderTemplate')
        .mockResolvedValue('html content');

      await service.notifyThroughMail(mailInformation);

      expect(formatDateToHumanReadable).toHaveBeenCalledTimes(2);
      expect(formatDateToHumanReadable).toHaveBeenCalledWith(parsedFlightDate);
      expect(fs.readFileSync).toHaveBeenCalledWith(cssPath, 'utf8');
      expect(renderTemplateMock).toHaveBeenCalledWith(templatePath, {
        formattedStartDate: 'July 15, 2022',
        formattedDayToBuy: 'June 15, 2022',
        departureHour: mailInformation.departureHour,
        departureMinute: mailInformation.departureMinute,
        cssContent: cssContent,
      });
      expect(transporterMock.sendMail).toHaveBeenCalledWith({
        from: EMAIL_CONFIG.ADMIN_EMAIL,
        to: mailInformation.toEmail,
        subject: 'Best Flight Fare Deals',
        html: 'html content',
      });
    });

    it('should handle errors gracefully when rendering template fails', async () => {
      const mailInformation: EmailDto = {
        toEmail: 'daniel.znaceni@gmail.com',
        flightDate: '2022-07-15',
        predictedDays: 30,
        departureHour: 14,
        departureMinute: 30,
      };

      (formatDateToHumanReadable as jest.Mock)
        .mockReturnValueOnce('July 15, 2022')
        .mockReturnValueOnce('June 15, 2022');

      const cssContent = 'css content';
      (fs.readFileSync as jest.Mock).mockReturnValue(cssContent);

      jest
        .spyOn(service, 'renderTemplate')
        .mockRejectedValue(new Error('Template rendering failed'));

      await expect(service.notifyThroughMail(mailInformation)).rejects.toThrow(
        new HttpException(
          'Failed to send notification email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should handle errors gracefully when sending mail fails', async () => {
      const mailInformation: EmailDto = {
        toEmail: 'daniel.znaceni@gmail.com',
        flightDate: '2022-07-15',
        predictedDays: 30,
        departureHour: 14,
        departureMinute: 30,
      };

      (formatDateToHumanReadable as jest.Mock)
        .mockReturnValueOnce('July 15, 2022')
        .mockReturnValueOnce('June 15, 2022');

      const cssContent = 'css content';
      (fs.readFileSync as jest.Mock).mockReturnValue(cssContent);

      jest.spyOn(service, 'renderTemplate').mockResolvedValue('html content');

      transporterMock.sendMail.mockRejectedValue(
        new Error('Sending mail failed'),
      );

      await expect(service.notifyThroughMail(mailInformation)).rejects.toThrow(
        new HttpException(
          'Failed to send notification email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('sendMail', () => {
    it('should send an email', async () => {
      const mailOptions = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Test Email</p>',
      };

      await service.sendMail(mailOptions);

      expect(transporterMock.sendMail).toHaveBeenCalledWith(mailOptions);
    });

    it('should handle errors gracefully when sending email fails', async () => {
      const mailOptions = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Test Email</p>',
      };

      transporterMock.sendMail.mockRejectedValue(
        new Error('Sending mail failed'),
      );

      await expect(service.sendMail(mailOptions)).rejects.toThrow(
        new HttpException(
          'Failed to send email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
