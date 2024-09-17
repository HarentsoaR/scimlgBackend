import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from '../services/comments.service';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { CreateCommentDto } from '../model/dto/comment/create-comment.dto';
import { Comment } from '../model/comment.entity';

@Controller('articles')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':articleId/comments')
    async addComment(
        @Param('articleId') articleId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() request: any, // Use 'any' or a custom request type if needed
    ): Promise<Comment> {
        const userId = request.user.id; // Access user ID from the request
        return this.commentsService.createComment(articleId, userId, createCommentDto);
    }

    @Get(':articleId/comments')
    async getComments(@Param('articleId') articleId: number): Promise<Comment[]> {
        return this.commentsService.getCommentsByArticle(articleId);
    }
}
