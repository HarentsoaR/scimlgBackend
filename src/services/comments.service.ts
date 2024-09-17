import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../model/article.entity';
import { CreateCommentDto } from '../model/dto/comment/create-comment.dto';
import { User } from '../model/user.entity';
import { Comment } from '../model/comment.entity';

import { Repository, DeepPartial } from 'typeorm';  



@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createComment(articleId: number, userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
        const article = await this.articleRepository.findOne({ where: { id: articleId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!article || !user) {
            throw new Error('Article or User not found');
        }

        const comment = this.commentRepository.create({
            article,
            user,
            content: createCommentDto.content,
        } as DeepPartial<Comment>); // Explicitly specify the type

        return this.commentRepository.save(comment);
    }

    async getCommentsByArticle(articleId: number): Promise<Comment[]> {
        return this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .where('comment.articleId = :articleId', { articleId })
            .getMany();
    }
}
