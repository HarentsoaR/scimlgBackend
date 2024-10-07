import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
export class Evaluation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, article => article.evaluations)
    article: Article;

    @ManyToOne(() => User, user => user.evaluations)
    evaluator: User;

    @Column({ type: 'int', default: 0 })
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
