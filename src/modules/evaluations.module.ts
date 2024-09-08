import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsController } from '../controller/evaluations.controller';
import { EvaluationsService } from '../services/evaluations.service';
import { Evaluation } from '../model/evaluation.entity';
import { ArticlesService } from '../services/articles.service';
import { Article } from '../model/article.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Evaluation]),TypeOrmModule.forFeature([Article]),
    ConfigModule.forRoot(), //Load env config
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Replace with your own secret
      signOptions: { expiresIn: '1h' }, // Token expiration time
    })],
    controllers: [EvaluationsController],
    providers: [EvaluationsService, ArticlesService],
})
export class EvaluationsModule {}
