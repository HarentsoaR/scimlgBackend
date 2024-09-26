
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../services/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from '../model/user.entity';
import { Notification } from '../model/notification.entity';
import { NotificationService } from '../services/notifications.service';
import { NotificationController } from '../controller/notifications.controller';
import { ArticlesService } from '../services/articles.service';
import { Follow } from '../model/follow.entity';
import { Article } from '../model/article.entity';
import { Like } from '../model/like.entity';
import { LikesService } from '../services/likes.service';
import { FollowService } from '../services/follow.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, User, Follow, Article, Like]), ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '1h' },
        })],
    providers: [NotificationService, UsersService,  ArticlesService, LikesService, FollowService],
    controllers: [NotificationController],
    exports: [NotificationService],
})
export class NotificationModule {}
