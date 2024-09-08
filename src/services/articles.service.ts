import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../model/article.entity';
import { CreateArticleDto } from '../model/dto/articles/create-article.dto';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) { }

    async createArticle(createArticleDto: CreateArticleDto, user: User): Promise<Article> {
        const article = this.articleRepository.create({
            ...createArticleDto,
            user, // Associate the article with the user who created it
        });
        return this.articleRepository.save(article);
    }
    async findAll(): Promise<Article[]> {
        try {
            const articles = await this.articleRepository.find({ relations: ['user', 'evaluations', 'comments'] }); // Adjust relations as needed
            if (!articles.length) {
                throw new NotFoundException('No articles found.');
            }
            return articles;
        } catch (error) {
            // Handle specific errors if needed
            throw new Error('Error retrieving articles: ' + error.message);
        }
    }

    async findAllByUser(userId: string): Promise<Article[]> {
        const userIdNumber = parseInt(userId, 10); // Convert string to number
        if (isNaN(userIdNumber)) {
            throw new Error('Invalid user ID');
        }

        return this.articleRepository.find({
            where: { user: { id: userIdNumber } }, // Use the converted userIdNumber
        });
    }
    }
