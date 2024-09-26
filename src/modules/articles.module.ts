import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from '../controller/articles.controller';
import { User } from '../model/user.entity';
import { Like } from '../model/like.entity';
import { Article } from '../model/article.entity';
import { ArticlesService } from '../services/articles.service';
import { FollowService } from '../services/follow.service';
import { Follow } from '../model/follow.entity';
import { NotificationService } from '../services/notifications.service';
import { Notification } from '../model/notification.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Article, Like, User, Follow, Notification]),
    ConfigModule.forRoot(), //Load env config
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Replace with your own secret
      signOptions: { expiresIn: '1h' }, // Token expiration time
    })],
    controllers: [ArticlesController],
    providers: [ArticlesService, FollowService, NotificationService],
})
export class ArticlesModule {}
