// src/users/users.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controller/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../services/auth.service'
import { JwtStrategy } from '../services/jwt.strategy';
import { FollowModule } from './follow.module';
import { User } from '../model/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => FollowModule),
  ConfigModule.forRoot(), //Load env config
  JwtModule.register({
    secret: process.env.JWT_SECRET_KEY, // Replace with your own secret
    signOptions: { expiresIn: '1h' }, // Token expiration time
  }), ], 
  providers: [UsersService, AuthService, JwtStrategy],
  controllers: [UsersController],
}) 
export class UsersModule {}
