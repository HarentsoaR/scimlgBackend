import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, article => article.likes, { onDelete: 'CASCADE' })
    article: Article;

    @ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}
