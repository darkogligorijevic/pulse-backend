import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MarkReadDto } from './dto/mark-read.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private notificationsService: NotificationsService
    ) {}

    @Patch('mark-as-read')
    @ApiOperation({ summary: 'Mark as read' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    markAsRead(@Request() req, @Body() dto: MarkReadDto) {
        return this.notificationsService.markAsRead(req.user.userId, dto);
    }

    @Patch('mark-all-as-read')
    @ApiOperation({ summary: 'Mark all as read' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    markAllAsRead(@Request() req) {
        return this.notificationsService.markAllAsRead(req.user.userId);
    }
}
