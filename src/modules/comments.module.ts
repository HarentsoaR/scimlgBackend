import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from '../services/articles.service';
import { CommentsService } from '../services/comments.service';
import { UsersService } from '../services/users.service';
import { Article } from '../model/article.entity';
import { User } from '../model/user.entity';
import { CommentsController } from '../controller/comments.controller';
import { Comment } from '../model/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment]),TypeOrmModule.forFeature([Article]),TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(), //Load env config
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Replace with your own secret
      signOptions: { expiresIn: '1h' }, // Token expiration time
    })],
    controllers: [CommentsController],
    providers: [CommentsService, ArticlesService, UsersService],
})
export class CommentsModule {}
