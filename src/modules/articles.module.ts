import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from '../controller/articles.controller';
import { User } from '../model/user.entity';
import { Like } from '../model/like.entity';
import { Article } from '../model/article.entity';
import { ArticlesService } from '../services/articles.service';


@Module({
    imports: [TypeOrmModule.forFeature([Article, Like, User]),
    ConfigModule.forRoot(), //Load env config
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Replace with your own secret
      signOptions: { expiresIn: '1h' }, // Token expiration time
    })],
    controllers: [ArticlesController],
    providers: [ArticlesService],
})
export class ArticlesModule {}
