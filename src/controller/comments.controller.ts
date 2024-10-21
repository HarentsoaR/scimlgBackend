import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from '../services/comments.service';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { CreateCommentDto } from '../model/dto/comment/create-comment.dto';
import { Comment } from '../model/comment.entity';
import { NotificationService } from '../services/notifications.service';
import { ArticlesService } from '../services/articles.service';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService,
        private readonly notificationService: NotificationService,
        private readonly articleService: ArticlesService
    ) { }

    // @UseGuards(JwtAuthGuard)
    // @Post(':articleId/comments')
    // async addComment(
    //     @Param('articleId') articleId: number,
    //     @Body() createCommentDto: CreateCommentDto,
    //     @Req() request: any, // Use 'any' or a custom request type if needed
    // ): Promise<Comment> {
    //     const userId = request.user.id; // Access user ID from the request
    //     return this.commentsService.createComment(articleId, userId, createCommentDto);
    // }
    @UseGuards(JwtAuthGuard)
    @Post(':articleId/comments')
    async addComment(
        @Param('articleId') articleId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() request: any, // Use 'any' or a custom request type if needed
    ): Promise<Comment> {
        const userId = request.user.id; // Access user ID from the request

        // Create the comment
        const comment = await this.commentsService.createComment(articleId, userId, createCommentDto);

        // Fetch the article to get the author's information
        const article = await this.articleService.getArticleById(articleId); // Create this method in CommentsService

        // Check if the current user is the author of the article
        const isAuthor = article.user.id === userId; // Ensure you're comparing the IDs

        // Send notification to the article author only if the user is not the author
        if (!isAuthor) {
            try {
                await this.notificationService.createNotification(article.user.id, `${request.user.username} commented on your article about ${article.title}`);
            } catch (error) {
                console.error(`Failed to notify user ${article.user.id}:`, error);
            }
        }

        return comment;
    }


    @Get(':articleId/comments')
    async getComments(@Param('articleId') articleId: number): Promise<Comment[]> {
        return this.commentsService.getCommentsByArticle(articleId);
    }
}
