// src/users/users.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'; // Corrected import
import { JwtPayload } from 'jsonwebtoken';
import { CreateUserDto } from '../model/dto/users/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const { password, ...result } = user; // Exclude password from result
        return result;
      }
    }
    return null;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const { name, password, email, role, title, bio, institution } = createUserDto; // Updated to match the DTO
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const profilePicture = name.charAt(0).toUpperCase();

    const newUser = this.userRepository.create({
      name,
      password: hashedPassword,
      email,
      role,
      profilePicture,
      title,
      bio,
      institution
    });

    return await this.userRepository.save(newUser);
  }

  async updateUser(id: number, userData: Partial<User>, accessToken: string): Promise<User> {
    const isAdmin = await this.validateAccessToken(accessToken);

    // if (!isAdmin) {
    //   throw new ForbiddenException('Only admins can update users');
    // }

    const user = await this.userRepository.findOne(({ where: { id } }));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, userData); // Update the user with new data
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number, accessToken: string): Promise<void> {
    const isAdmin = await this.validateAccessToken(accessToken);

    if (!isAdmin) {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.userRepository.findOne(({ where: { id } }));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user); // Delete the user
  }

  async getUsers(accessToken?: string): Promise<User[]> {
    try {
      // Validate the access token
      const isAdmin = accessToken ? await this.validateAccessToken(accessToken) : false;

      // // If the user is not an admin and an access token was provided, throw an exception
      // if (accessToken && !isAdmin) {
      //   throw new ForbiddenException('Only admins can access this resource');
      // }

      // Proceed with the query to get all users
      return await this.userRepository.find();
    } catch (error) {
      console.error(error.message);
      throw new ForbiddenException('Forbidden');
    }
  }

  
  async validateAccessToken(accessToken: string): Promise<boolean> {
    let isAdmin = false;

    try {
      const decodedToken = jwt.verify(accessToken, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMzgyOTc3NywiaWF0IjoxNzIzODI5Nzc3fQ.Akto36lRJWwuP50aHNAMCX7EB6uQat1Hhzn9lt2aG7U') as JwtPayload;
      isAdmin = decodedToken.role === 'admin'; // Check if the user is an admin
    } catch (error) {
      throw new ForbiddenException('Invalid access token');
    }

    return isAdmin;
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { name: username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }
  
  async countUsers(): Promise<number> {
    const count = await this.userRepository.createQueryBuilder('user')
      .getCount();
    return count;
  }
}
