import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';


@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, article => article.comments, { eager: true })
    article: Article;

    @ManyToOne(() => User, user => user.comments, { eager: true })
    user: User;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
