
import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../model/follow.entity';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(Follow)
        private followRepository: Repository<Follow>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async followUser(followerId: number, followedId: number): Promise<Follow> {
        if (followerId === followedId) {
            throw new ForbiddenException("You cannot follow yourself");
        }

        const follower = await this.userRepository.findOne({ where: { id: followerId } });
        const followed = await this.userRepository.findOne({ where: { id: followedId } });

        if (!follower || !followed) {
            throw new NotFoundException("User not found");
        }

        const follow = this.followRepository.create({ follower, followed });
        return this.followRepository.save(follow);
    }

    async unfollowUser(followerId: number, followedId: number): Promise<void> {
        const follow = await this.followRepository.findOne({
            where: { follower: { id: followerId }, followed: { id: followedId } },
        });

        if (!follow) {
            throw new NotFoundException("Follow relationship not found");
        }

        await this.followRepository.remove(follow);
    }

    async getFollowers(userId: number): Promise<User[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['followers', 'followers.follower'], // Load followers and their user details
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }
        // Return the actual follower users
        return user.followers.map(follow => follow.follower);
    }

    async getFollowing(userId: number): Promise<User[]> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user.following.map(follow => follow.followed);
    }

    async getFollowings(userId: number): Promise<number[]> {
        const following = await this.followRepository.find({
            where: { follower: { id: userId } },
        });

        return following.map(follow => follow.followed.id); // Return the IDs of the followed users
    }


    async countFollowers(userId: number): Promise<number> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['followers'],
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Return the count of followers
        return user.followers.length;
    }

    async countFollowing(userId: number): Promise<number> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['following'],
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Return the count of following
        return user.following.length;
    }


    async isUserFollowingUser(followerId: number, followedId: number): Promise<boolean> {
        const followRecord = await this.followRepository.findOne({
            where: {
                follower: { id: followerId },
                followed: { id: followedId },
            },
        });

        return !!followRecord; // Return true if the record exists, false otherwise
    }


}
