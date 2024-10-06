import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { NotificationService } from '../services/notifications.service';
import { Notification } from '../model/notification.entity';
import { UsersService } from '../services/users.service';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService,
                private readonly userService: UsersService
    ) { }

    @Get(':userId')
    async getUserNotifications(@Param('userId') userId: number): Promise<Notification[]> {
        return this.notificationService.getUserNotifications(userId);
    }

    @Post()
    async createNotification(@Body() body: { userId: number; message: string }): Promise<Notification> {
        const user = await this.userService.findById(body.userId);
        return this.notificationService.createNotification(user, body.message);
    }

    @Put(':id/read')
    async markAsRead(@Param('id') id: number): Promise<Notification> {
        return this.notificationService.markAsRead(id);
    }
    
    @Get(':id/read-status')
    async checkReadStatus(@Param('id') id: number): Promise<{ isRead: boolean }> {
        const isRead = await this.notificationService.isNotificationRead(id);
        return { isRead };
    }
}
