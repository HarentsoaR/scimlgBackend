import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../model/like.entity';
import { Article } from '../model/article.entity';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) { }

    async likeArticle(articleId: number, user: User): Promise<Like> {
        // Fetch the article with likes
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
            relations: ['likes', 'likes.user'] // Ensure user details are included
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        // Check if the user has already liked the article
        const existingLike = article.likes.find(like => like.user && like.user.id === user.id);

        if (existingLike) {
            // If the user has already liked, remove the like (dislike)
            await this.likeRepository.remove(existingLike);
            return existingLike; // Return the removed like for confirmation
        }

        // Create a new like
        const like = this.likeRepository.create({ article, user });
        return this.likeRepository.save(like);
    }

    async hasUserLikedArticle(articleId: number, user: User): Promise<boolean> {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
            relations: ['likes', 'likes.user'],
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        return article.likes.some(like => like.user?.id === user.id);
    }


    async getMostLikedArticles(): Promise<{ title: string; likeCount: number }[]> {
        const result = await this.likeRepository
            .createQueryBuilder('like')
            .select('article.title', 'title')
            .addSelect('COUNT(like.id)', 'likeCount') // This is an alias, not a column
            .innerJoin('like.article', 'article') // Join with the Article entity
            .groupBy('article.id') // Group by article ID
            .addGroupBy('article.title') // Also group by title to avoid SQL errors
            .getRawMany();
    
        return result.map(item => ({
            title: item.title,
            likeCount: parseInt(item.likeCount, 10) || 0, // Ensure likeCount is a number
        }));
    }
    
}
