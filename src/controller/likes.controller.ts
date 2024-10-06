// src/likes/likes.controller.ts
import { Controller, Post, Param, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { LikesService } from '../services/likes.service';
import { CustomRequest } from '../interfaces/request.interface'; // Import CustomRequest
import { Like } from '../model/like.entity';
import { ArticlesService } from '../services/articles.service';
import { NotificationService } from '../services/notifications.service';

@Controller('likes')
export class LikesController {
    constructor(private readonly likesService: LikesService,
        private readonly articleService: ArticlesService,
        private readonly notificationService: NotificationService

    ) { }

    @UseGuards(JwtAuthGuard)
    @Post(':articleId')
    async like(@Param('articleId') articleId: number, @Req() req: CustomRequest): Promise<Like> {
        const user = req.user; // Current user liking the article
        const article = await this.articleService.getArticleById(articleId); // Fetch the article

        // Fetch the article with likes to check for existing like
        const existingLike = await this.likesService.hasUserLikedArticle(articleId, user);

        if (!existingLike) {
            // Notify the author of the article about the new like
            try {
                await this.notificationService.createNotification(article.user, `${user.username} liked your article: ${article.title} `);
            } catch (error) {
                console.error(`Failed to notify user ${article.user.id}:`, error);
            }
        }

        // Proceed to like or dislike the article
        return this.likesService.likeArticle(articleId, user);
    }


    @UseGuards(JwtAuthGuard)
    @Get('check/:articleId')
    async checkUserLike(@Param('articleId') articleId: number, @Req() req: CustomRequest): Promise<boolean> {
        const user = req.user; // Now this will be of type User
        return this.likesService.hasUserLikedArticle(articleId, user);
    }
}
