import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controller/auth.controller';
import { GoogleStrategy } from '../google.strategy';
import { FacebookStrategy } from '../facebook.strategy';


@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google', session: true }),],
  controllers: [AuthController],
  providers: [GoogleStrategy, FacebookStrategy],
})
export class AuthModule {}
