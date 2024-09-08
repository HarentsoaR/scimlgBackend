// src/users/users.controller.ts
import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../model/dto/users/create-user.dto';
import { User } from '../model/user.entity';
import { Request } from 'express';
import { JwtAuthGuard } from '../services/jwt-auth.guard';


@Controller('users')
export class UsersController {
  constructor(private userService: UsersService, private authService: AuthService) { }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) { // Changed from username to email
    const user = await this.authService.validateUser(email, password);
    if (user) {
      console.log("Login successful for: " + user.name); // Changed username to name
      const token = await this.authService.login(user);
      return { loggedIn: true, ...token };
    } else {
      return { loggedIn: false };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request): Promise<User[]> {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
      throw new BadRequestException('Access token is missing');
    }
    return this.userService.getUsers(accessToken);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: number): Promise<User> {
    try {
      return await this.userService.findById(userId);
    } catch (error) {
      // Handle NotFoundException and other errors
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('An error occurred while fetching user data');
    }
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() userData: Partial<User>, @Req() req: Request): Promise<User> {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new BadRequestException('Access token is missing');
    }

    return this.userService.updateUser(id, userData, accessToken);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number, @Req() req: Request): Promise<void> {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new BadRequestException('Access token is missing');
    }

    return this.userService.deleteUser(id, accessToken);
  }
  
}
