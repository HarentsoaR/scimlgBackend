import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from '../services/likes.service';
import { LikesController } from '../controller/likes.controller';
import { JwtModule } from '@nestjs/jwt';
import { Like } from '../model/like.entity';
import { Article } from '../model/article.entity';
import { User } from '../model/user.entity';



@Module({
    imports: [
        TypeOrmModule.forFeature([Like, Article, User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY, // Replace with your own secret
            signOptions: { expiresIn: '1h' }, // Token expiration time
        })],
    providers: [LikesService],
    controllers: [LikesController],
})
export class LikesModule { }
