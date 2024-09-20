
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../services/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from '../model/user.entity';
import { Active } from '../model/active.entity';
import { ActiveService } from '../services/active.service';
import { ActiveController } from '../controller/active.controller';


@Module({
    imports: [
        TypeOrmModule.forFeature([Active, User]), ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '1h' },
        })],
    providers: [ActiveService],
    controllers: [ActiveController],
    exports: [ActiveService],
})
export class ActiveModule {}
