// active-user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Active } from '../model/active.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActiveService {
    constructor(
        @InjectRepository(Active)
        private readonly activeUserRepository: Repository<Active>,
    ) {}

    async isUserActive(userId: number): Promise<boolean> {
        const activeUser = await this.activeUserRepository.findOne({ where: { userId } });
        return !!activeUser; // Returns true if user exists, false otherwise
    }

    // Optional: Method to add an active user
    async addActiveUser(userId: number): Promise<Active> {
        const activeUser = this.activeUserRepository.create({ userId });
        return this.activeUserRepository.save(activeUser);
    }

    // Optional: Method to remove an active user
    async disconnectUser(userId: number): Promise<void> {
        await this.activeUserRepository.delete({ userId });
    }
}
