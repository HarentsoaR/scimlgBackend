
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowService } from '../services/follow.service';
import { FollowController } from '../controller/follow.controller';
import { UsersService } from '../services/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Follow } from '../model/follow.entity';
import { User } from '../model/user.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Follow, User]), ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '1h' },
        })],
    providers: [FollowService, UsersService],
    controllers: [FollowController],
    exports: [FollowService],
})
export class FollowModule {}