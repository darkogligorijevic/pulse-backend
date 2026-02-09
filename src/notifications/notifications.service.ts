import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>
    ) {}

    // create notification
    async create(dto: CreateNotificationDto ) : Promise<Notification> {
        const notification = this.notificationsRepository.create(dto);
        return this.notificationsRepository.save(notification);
    }

    // mark-as-read 
    async MarkAsRead(userId: number) {
        await this.notificationsRepository.update(
            {
                toUserId: userId,
                isRead: false
            },
            {
                isRead: true
            }
        );

        return { message: 'Notification is read!' } 
    }
}
