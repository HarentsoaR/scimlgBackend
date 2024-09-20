import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../model/article.entity';
import { CreateArticleDto } from '../model/dto/articles/create-article.dto';
import { User } from '../model/user.entity';
import { Repository, In } from 'typeorm';


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
            const articles = await this.articleRepository.find({
                relations: ['user', 'evaluations', 'comments', 'likes', 'likes.user'],
            });

            if (!articles.length) {
                throw new NotFoundException('No articles found.');
            }

            // Map articles to include likeCounts
            const articlesWithLikeCounts = articles.map(article => {
                const likeCounts = article.likes ? article.likes.length : 0; // Count the likes
                return {
                    ...article,
                    likeCounts, // Add the likeCounts field
                };
            });

            return articlesWithLikeCounts;
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

    async findAllByUserIds(userIds: number[]): Promise<Article[]> {
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return []; // Return an empty array if no user IDs
        }

        // Fetch articles for all followed users
        const articles = await this.articleRepository.find({
            where: { user: { id: In(userIds) } },
            relations: ['user', 'likes'], // Include user and likes information
        });

        // Map articles to include likeCounts
        const articlesWithLikeCounts = articles.map(article => {
            const likeCounts = article.likes ? article.likes.length : 0; // Count the likes
            return {
                ...article,
                likeCounts, // Add the likeCounts field
            };
        });

        return articlesWithLikeCounts; // Return the modified articles
    }


    async approveArticle(articleId: number): Promise<Article> {
        if (!articleId) {
            throw new NotFoundException('Article ID must be provided');
        }
        const article = await this.articleRepository.findOne({ where: { id: articleId } });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        article.status = 'accepted'; // Update the status to approved
        return this.articleRepository.save(article);
    }

    async rejectArticle(articleId: number): Promise<Article> {
        if (!articleId) {
            throw new NotFoundException('Article ID must be provided');
        }

        const article = await this.articleRepository.findOne({ where: { id: articleId } });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        article.status = 'rejected'; // Update the status to rejected
        return this.articleRepository.save(article);
    }

    async getLikesForArticle(articleId: number): Promise<User[]> {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
            relations: ['likes', 'likes.user'], // Ensure you fetch likes and their associated users
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        // Return the users who liked the article
        return article.likes.map(like => like.user);
    }
}
