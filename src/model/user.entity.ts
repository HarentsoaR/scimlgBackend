import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { Notification } from './notification.entity';
import { Article } from './article.entity';
import { Evaluation } from './evaluation.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['researcher', 'evaluator', 'admin'] })
    role: 'researcher' | 'evaluator' | 'admin';

    @Column({ nullable: true }) // Optional field
    title: string;

    @Column({ nullable: true }) // Optional field
    institution: string;

    @Column({ nullable: true }) // Optional field
    bio: string;

    @Column({ nullable: true }) // Optional field
    profilePicture: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Article, article => article.user)
    articles: Article[];

    @OneToMany(() => Evaluation, evaluation => evaluation.evaluator)
    evaluations: Evaluation[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];

    // Add relations for publications, connections, and achievements if needed
}
