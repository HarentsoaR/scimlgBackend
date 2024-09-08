// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controller/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../services/auth.service'
import { JwtStrategy } from '../services/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  ConfigModule.forRoot(), //Load env config
  JwtModule.register({
    secret: process.env.JWT_SECRET_KEY, // Replace with your own secret
    signOptions: { expiresIn: '1h' }, // Token expiration time
  }), ], 
  providers: [UsersService, AuthService, JwtStrategy],
  controllers: [UsersController],
}) 
export class UsersModule {}
