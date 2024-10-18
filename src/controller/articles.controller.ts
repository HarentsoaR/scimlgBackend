import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch, Put } from '@nestjs/common';
import { Request } from 'express';
import { Article } from '../model/article.entity';
import { CreateArticleDto } from '../model/dto/articles/create-article.dto';
import { User } from '../model/user.entity';
import { ArticlesService } from '../services/articles.service';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { CustomRequest } from '../interfaces/request.interface';
import { FollowService } from '../services/follow.service';
import { NotificationService } from '../services/notifications.service';
import { UpdateArticleDto } from '../model/dto/articles/update-article.dto';


@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService,
        private readonly followService: FollowService,
        private readonly notificationService: NotificationService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createArticleDto: CreateArticleDto, @Req() req: CustomRequest): Promise<Article> {
        const user = req.user as User; // Assuming user is attached to the request by the JWT guard

        // Create the article
        const article = await this.articlesService.createArticle(createArticleDto, user);

        // Fetch followers of the user
        const followers = await this.followService.getFollowers(user.id); // Implement this method in FollowService

        // Notify each follower about the new article
        followers.forEach(async (follower) => {
            await this.notificationService.createNotification(follower, `${user.username} has posted a new article: ${article.title}`);
        });

        return article;
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<Article[]> {
        return this.articlesService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':userId/user')
    async findAllByUser(@Param('userId') userId: string): Promise<Article[]> {
        return this.articlesService.findAllByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/approve')
    async approve(@Param('id') id: string): Promise<Article> {
        return this.articlesService.approveArticle(+id); // Convert string to number
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/reject')
    async reject(@Param('id') id: string): Promise<Article> {
        return this.articlesService.rejectArticle(+id); // Convert string to number
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/likes') // New route to get users who liked the article
    async getLikes(@Param('id') id: string): Promise<User[]> {
        return this.articlesService.getLikesForArticle(+id); // Convert string to number
    }

    @UseGuards(JwtAuthGuard)
    @Get('followed')
    async findAllFromFollowedUsers(@Req() req: CustomRequest): Promise<Article[]> {
        const userId = req.user.id;
        const followedUserIds = await this.followService.getFollowings(userId); // Get followed user IDs
        return this.articlesService.findAllByUserIds(followedUserIds); // Fetch articles for those user IDs
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('search/title/:title')
    async searchArticlesByTitle(@Param('title') title: string): Promise<Article[]> {
        return this.articlesService.findByTitle(title);
    }
    @UseGuards(JwtAuthGuard) // Protect the route with authentication
    @Put(':id')
    async updateArticle(
        @Param('id') id: number,
        @Body() updateArticleDto: UpdateArticleDto,
    ): Promise<Article> {
        return this.articlesService.updateArticle(id, updateArticleDto);
    }
}
