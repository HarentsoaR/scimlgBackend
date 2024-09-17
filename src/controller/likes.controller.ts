// src/likes/likes.controller.ts
import { Controller, Post, Param, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { LikesService } from '../services/likes.service';
import { CustomRequest } from '../interfaces/request.interface'; // Import CustomRequest
import { Like } from '../model/like.entity';

@Controller('likes')
export class LikesController {
    constructor(private readonly likesService: LikesService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':articleId')
    async like(@Param('articleId') articleId: number, @Req() req: CustomRequest): Promise<Like> {
        const user = req.user; // Now this will be of type User
        return this.likesService.likeArticle(articleId, user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('check/:articleId')
    async checkUserLike(@Param('articleId') articleId: number, @Req() req: CustomRequest): Promise<boolean> {
        const user = req.user; // Now this will be of type User
        return this.likesService.hasUserLikedArticle(articleId, user);
    }
}
