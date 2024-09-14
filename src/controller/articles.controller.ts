import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Article } from 'src/model/article.entity';
import { CreateArticleDto } from '../model/dto/articles/create-article.dto';
import { User } from '../model/user.entity';
import { ArticlesService } from '../services/articles.service';
import { JwtAuthGuard } from '../services/jwt-auth.guard';


@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createArticleDto: CreateArticleDto, @Req() req: Request): Promise<Article> {
        const user = req.user as User; // Assuming user is attached to the request by the JWT guard
        return this.articlesService.createArticle(createArticleDto, user);
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<Article[]> {
        return this.articlesService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':userId')
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

}
