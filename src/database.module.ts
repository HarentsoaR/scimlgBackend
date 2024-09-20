import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './model/article.entity';
import { Evaluation } from './model/evaluation.entity';
import { Notification } from './model/notification.entity';
import { Comment } from './model/comment.entity';
import { User } from './model/user.entity';
import { Like } from './model/like.entity';
import { Follow } from './model/follow.entity';
import { Active } from './model/active.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Adjust based on your PostgreSQL server location
      port: 5432, // Default PostgreSQL port
      username: 'postgres', // Your PostgreSQL username
      password: '1234', // Your PostgreSQL password
      database: 'scigasy', // Name of your database
      autoLoadEntities: true,
      entities: [User, Article, Notification, Evaluation, Comment, Like, Follow, Active],
      // logging: true,
      synchronize: true, // Automatically create database schema on every application launch
    }),
  ],
})
export class DatabaseModule {}
