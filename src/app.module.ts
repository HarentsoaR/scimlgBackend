import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/module/auth.module';
import { UsersModule } from './modules/users.module';
import { ArticlesModule } from './modules/articles.module';
import { EvaluationsModule } from './modules/evaluations.module';
import { CommentsModule } from './modules/comments.module';
import { LikesModule } from './modules/likes.module';
import { FollowModule } from './modules/follow.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, ArticlesModule, EvaluationsModule, CommentsModule, LikesModule, FollowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
