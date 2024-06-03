import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './email.service';
import { EmailDto } from './email.dto';

@Controller('mail')
export class EmailController {
  constructor(private readonly emailService: MailService) {}

  @Post()
  async sendMail(@Body() mailDetails: EmailDto): Promise<void> {
    return this.emailService.notifyThroughMail(mailDetails);
  }
}
