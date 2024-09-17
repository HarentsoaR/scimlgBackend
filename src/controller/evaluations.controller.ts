import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { EvaluationsService } from '../services/evaluations.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { CreateEvaluationDto } from '../model/dto/evaluation/create-evaluation.dto';
import { User } from '../model/user.entity';
import { Evaluation } from '../model/evaluation.entity';


@Controller('evaluations')
export class EvaluationsController {
    constructor(private readonly evaluationsService: EvaluationsService) {}

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
}
