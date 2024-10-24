import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../model/article.entity';
import { Evaluation } from '../model/evaluation.entity';
import { Repository } from 'typeorm';
import { CreateEvaluationDto } from '../model/dto/evaluation/create-evaluation.dto';
import { User } from '../model/user.entity';
import { UpdateRatingDto } from '../model/dto/evaluation/updateRatingDto';



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
        // if (!evaluator.role.includes('evaluator')) {
        //     throw new ForbiddenException('You do not have permission to evaluate articles.');
        // }
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

    async getRatingForPublication(publicationId: number): Promise<number> {
        const evaluations = await this.evaluationRepository.find({
            where: { article: { id: publicationId } },
        });

        // Calculate the average rating if needed, or return the most recent rating
        if (evaluations.length === 0) {
            return 0; // No ratings found
        }

        const totalRating = evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0);
        return totalRating / evaluations.length; // Return average rating
    }

    async getUserRating(publicationId: number, userId: number): Promise<any> {
        return this.evaluationRepository.findOne({
            where: {
                article: { id: publicationId },
                evaluator: { id: userId }, // Change 'user' to 'evaluator'
            },
        });
    }

    async updateRating(id: number, updateRatingDto: UpdateRatingDto): Promise<any> {
        await this.evaluationRepository.update(id, updateRatingDto);
        return this.evaluationRepository.findOne({ where: { id } }); // Return the updated rating
    }

    async getRatingStatistics(): Promise<{ title: string; averageRating: number; totalRatings: number }[]> {
        const result = await this.evaluationRepository
            .createQueryBuilder('evaluation')
            .select('article.title', 'title')
            .addSelect('AVG(evaluation.rating)', 'averageRating') // Calculate average rating
            .addSelect('COUNT(evaluation.id)', 'totalRatings') // Count the number of ratings
            .innerJoin('evaluation.article', 'article') // Join with Article entity
            .groupBy('article.id') // Group by article ID
            .addGroupBy('article.title') // Group by title to avoid SQL errors
            .getRawMany();
    
        return result.map(item => ({
            title: item.title,
            averageRating: parseFloat(item.averageRating) || 0, // Ensure averageRating is a number
            totalRatings: parseInt(item.totalRatings, 10) || 0, // Ensure totalRatings is a number
        }));
    }    

}
