import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Notification } from '../model/notification.entity';
import { Repository } from 'typeorm';


@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) { }

    async createNotification(user: User, message: string): Promise<Notification> {
        const notification = this.notificationRepository.create({ user, message });
        return this.notificationRepository.save(notification);
    }

    async getUserNotifications(userId: number): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(notificationId: number): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
        if (notification) {
            notification.isRead = true;
            return this.notificationRepository.save(notification);
        }
        throw new Error('Notification not found');
    }
    async isNotificationRead(notificationId: number): Promise<boolean> {
        const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        return notification.isRead;
    }

}
