import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    providers: [NotificationsGateway, NotificationsService],
    exports: [NotificationsGateway],
    controllers: [NotificationsController],
})
export class NotificationsModule {}
