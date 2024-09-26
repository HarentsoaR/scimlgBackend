// src/follow/follow.controller.ts
import { Controller, Post, Delete, Param, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { CustomRequest } from '../interfaces/request.interface';
import { FollowService } from '../services/follow.service';
import { NotificationService } from '../services/notifications.service';

@Controller('follow')
export class FollowController {
    constructor(private followService: FollowService,
        private readonly notificationService: NotificationService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post(':followedId')
    async follow(@Param('followedId') followedId: number, @Req() req: CustomRequest) {
        const followerId = req.user.id; // Get the ID of the user who is following

        // Follow the user
        await this.followService.followUser(followerId, followedId);

        // Fetch the followed user details
        const followedUser = await this.followService.getUserById(followedId); // Assuming you have a method to get user details

        // Notify the followed user about the new follower
        try {
            await this.notificationService.createNotification(followedUser, `${req.user.username} started following you.`);
        } catch (error) {
            console.error(`Failed to notify user ${followedId}:`, error);
        }

        return { message: `You are now following user with ID ${followedId}` };
    }

    @Delete(':followedId')
    @UseGuards(JwtAuthGuard)
    async unfollow(@Param('followedId') followedId: number, @Req() req: CustomRequest) {
        const followerId = req.user.id; // Now this should work without errors
        return this.followService.unfollowUser(followerId, followedId);
    }

    @Get(':userId/followers')
    @UseGuards(JwtAuthGuard)
    async getFollowers(@Param('userId') userId: number) {
        return this.followService.getFollowers(userId);
    }

    @Get(':userId/following')
    @UseGuards(JwtAuthGuard)
    async getFollowing(@Param('userId') userId: number) {
        return this.followService.getFollowing(userId);
    }

    @Get(':userId/followers/count')
    @UseGuards(JwtAuthGuard)
    async countFollowers(@Param('userId') userId: number) {
        return this.followService.countFollowers(userId);
    }

    @Get(':userId/following/count')
    @UseGuards(JwtAuthGuard)
    async countFollowing(@Param('userId') userId: number) {
        return this.followService.countFollowing(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('check/:userId')
    async checkMutualFollow(@Param('userId') userId: number, @Req() req: CustomRequest): Promise<boolean> {
        const currentUser = req.user; // This should contain the current user's info
        return this.followService.isUserFollowingUser(currentUser.id, userId);
    }
}
