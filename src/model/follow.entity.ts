// src/model/follow.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.followers, { eager: true })
    follower: User;

    @ManyToOne(() => User, user => user.following, { eager: true })
    followed: User;

    @CreateDateColumn()
    createdAt: Date;
}
