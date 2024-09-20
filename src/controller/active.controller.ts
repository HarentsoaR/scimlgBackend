// active-user.controller.ts
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ActiveService } from '../services/active.service';
import { JwtAuthGuard } from '../services/jwt-auth.guard';


@Controller('active')
export class ActiveController {
    constructor(private readonly activeUserService: ActiveService) {}

    @UseGuards(JwtAuthGuard)
    @Get(':userId/check')
    async checkUserActive(@Param('userId') userId: number): Promise<{ isActive: boolean }> {
        const isActive = await this.activeUserService.isUserActive(userId);
        return { isActive };
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addActiveUser(@Body('userId') userId: number): Promise<{ message: string }> {
        await this.activeUserService.addActiveUser(userId);
        return { message: `User with ID ${userId} has been added as active.` };
    }

    @Delete(':userId')
    async disconnectUser(@Body('userId') userId: number): Promise<{ message: string }> {
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        await this.activeUserService.disconnectUser(userId);
        return { message: `User with ID ${userId} has been disconnected.` };
    }
}
