import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.entity';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { MarkReadDto } from './dto/mark-read.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>,

        private readonly gateway: NotificationsGateway
    ) {}

    // create notification
    async create(dto: CreateNotificationDto ) : Promise<Notification> {
        const notification = this.notificationsRepository.create(dto);
        return this.notificationsRepository.save(notification);
    }

    // mark-as-read 
    async markAllAsRead(userId: number) {
        await this.notificationsRepository.update(
            {
                toUserId: userId,
                isRead: false
            },
            {
                isRead: true
            }
        );

        // broadcast mark as read using websocket
        this.gateway.broadcastMarkAsAllRead(userId);

        return { message: 'All notifications are marked as read' } 
    }

    async markAsRead(userId: number, dto: MarkReadDto) {

        if (!dto || dto.ids.length === 0) throw new NotFoundException();

        await this.notificationsRepository.update(
            {
                id: In(dto.ids),
                toUserId: userId,
                isRead: false
            },
            {
                isRead: true
            }
        );

        this.gateway.broadcastMarkAsRead(userId, dto.ids);

        return { message: 'Marked notifications are read' }
    }
}
