import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsController } from '../controller/evaluations.controller';
import { EvaluationsService } from '../services/evaluations.service';
import { ArticlesService } from '../services/articles.service';
import { Evaluation } from '../model/evaluation.entity';
import { Article } from '../model/article.entity';
import { User } from '../model/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Evaluation]),TypeOrmModule.forFeature([Article, User]),
    ConfigModule.forRoot(), //Load env config
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Replace with your own secret
      signOptions: { expiresIn: '1h' }, // Token expiration time
    })],
    controllers: [EvaluationsController],
    providers: [EvaluationsService, ArticlesService],
})
export class EvaluationsModule {}
