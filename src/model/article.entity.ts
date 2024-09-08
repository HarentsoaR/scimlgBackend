import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Evaluation } from './evaluation.entity';
import { Comment } from './comment.entity';


@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    abstract: string;

    @Column('text')
    content: string;

    @Column({ type: 'enum', enum: ['submitted', 'under_review', 'accepted', 'rejected'] })
    status: 'submitted' | 'under_review' | 'accepted' | 'rejected';

    @ManyToOne(() => User, user => user.articles)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Evaluation, evaluation => evaluation.article)
    evaluations: Evaluation[];

    @OneToMany(() => Comment, comment => comment.article)
    comments: Comment[];
}
