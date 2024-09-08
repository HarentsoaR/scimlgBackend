import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluation } from '../model/evaluation.entity';
import { Repository } from 'typeorm';
import { Article } from '../model/article.entity';
import { CreateEvaluationDto } from '../model/dto/evaluation/create-evaluation.dto';
import { User } from '../model/user.entity';


@Injectable()
export class EvaluationsService {
    constructor(
        @InjectRepository(Evaluation)
        private readonly evaluationRepository: Repository<Evaluation>,
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) { }

    async createEvaluation(createEvaluationDto: CreateEvaluationDto, evaluator: User): Promise<Evaluation> {
        // Check if the user has the 'evaluator' role
        if (!evaluator.role.includes('evaluator')) {
            throw new ForbiddenException('You do not have permission to evaluate articles.');
        }
        // Use the correct syntax to find the article
        const article = await this.articleRepository.findOne({ where: { id: createEvaluationDto.articleId } });
        if (!article) {
            throw new Error('Article not found.');
        }
        const evaluation = this.evaluationRepository.create({
            ...createEvaluationDto,
            article,
            evaluator, // Associate the evaluation with the evaluator
        });
        return this.evaluationRepository.save(evaluation);
    }
    async findAllEvaluations(user: User): Promise<Evaluation[]> {
        // Check if the user has the 'admin' or 'evaluator' role
        if (!user.role.includes('admin') && !user.role.includes('evaluator')) {
            throw new ForbiddenException('You do not have permission to access evaluations.');
        }

        return this.evaluationRepository.find({ relations: ['article', 'evaluator'] }); // Adjust relations as needed
    }
}
