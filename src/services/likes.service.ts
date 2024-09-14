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

}
