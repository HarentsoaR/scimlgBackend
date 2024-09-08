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

    @Column('text')
    comments: string;

    @Column({ type: 'int', default: 0 })
    rating: number;

    @Column({ type: 'enum', enum: ['pending', 'completed'] })
    status: 'pending' | 'completed';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
