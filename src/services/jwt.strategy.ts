import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from './users.service'; // Adjust the import according to your structure
import { User } from '../model/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMzgyOTc3NywiaWF0IjoxNzIzODI5Nzc3fQ.Akto36lRJWwuP50aHNAMCX7EB6uQat1Hhzn9lt2aG7U' // Replace with your actual secret
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.usersService.findById(payload.id); // Assuming 'sub' is the user ID in the payload
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
