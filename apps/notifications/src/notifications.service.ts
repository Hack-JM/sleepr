import { Injectable, Logger } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  protected readonly logger = new Logger(NotificationsService.name);

  async notifyEmail({ email, text }: NotifyEmailDto) {
    this.logger.log(`Sending email to ${email} with text: ${text}`);
  }
}
