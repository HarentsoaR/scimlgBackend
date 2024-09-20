import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('active')
export class Active {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    userId: number;
}
