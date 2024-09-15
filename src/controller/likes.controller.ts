import { Controller, Post, Param, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { LikesService } from '../services/likes.service';
import { Request } from 'express';
import { Like } from '../model/like.entity';

@Controller('likes')
export class LikesController {
    constructor(private readonly likesService: LikesService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':articleId')
    async like(@Param('articleId') articleId: number, @Req() req: Request): Promise<Like> {
        const user = req.user; // Assuming user is attached to the request by the JWT guard
        return this.likesService.likeArticle(articleId, user);
    }
    @UseGuards(JwtAuthGuard)
    @Get('check/:articleId')
    async checkUserLike(@Param('articleId') articleId: number, @Req() req): Promise<boolean> {
        const user = req.user; // Assuming user is set in the request
        return this.likesService.hasUserLikedArticle(articleId, user);
    }

}
