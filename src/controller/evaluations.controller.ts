import { Controller, Post, Body, Req, UseGuards, Get, Param, Put } from '@nestjs/common';
import { EvaluationsService } from '../services/evaluations.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { CreateEvaluationDto } from '../model/dto/evaluation/create-evaluation.dto';
import { User } from '../model/user.entity';
import { Evaluation } from '../model/evaluation.entity';
import { UpdateRatingDto } from '../model/dto/evaluation/updateRatingDto';


@Controller('evaluations')
export class EvaluationsController {
    constructor(private readonly evaluationsService: EvaluationsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createEvaluationDto: CreateEvaluationDto, @Req() req: Request): Promise<Evaluation> {
        const evaluator = req.user as User; // Assuming user is attached to the request by the JWT guard
        return this.evaluationsService.createEvaluation(createEvaluationDto, evaluator);
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Req() request: Request): Promise<Evaluation[]> {
        const user = request.user as User; // User info attached by the guard
        return this.evaluationsService.findAllEvaluations(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':publicationId/rate')
    async ratePublication(
        @Param('publicationId') publicationId: number,
        @Body() createEvaluationDto: CreateEvaluationDto,
        @Req() req: Request,
    ): Promise<Evaluation> {
        const evaluator = req.user as User;
        createEvaluationDto.articleId = publicationId; // Set the articleId to the publicationId
        return this.evaluationsService.createEvaluation(createEvaluationDto, evaluator);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':publicationId/rating')
    async getRating(@Param('publicationId') publicationId: number): Promise<number> {
        return this.evaluationsService.getRatingForPublication(publicationId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user-rating/:publicationId')
    async getUserRating(@Param('publicationId') publicationId: number, @Req() req): Promise<any> {
        const userId = req.user.id; // Use optional chaining to safely access user.id
        if (!userId) {
            throw new Error('User not authenticated'); // Handle case where user is not authenticated
        }
        return this.evaluationsService.getUserRating(publicationId, userId);
    }

    @Put(':id')
    async updateRating(@Param('id') id: number, @Body() updateRatingDto: UpdateRatingDto): Promise<any> {
        return this.evaluationsService.updateRating(id, updateRatingDto);
    }


}
