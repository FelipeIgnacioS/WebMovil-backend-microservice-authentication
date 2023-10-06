import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    type: string;

    @Column('timestamp')
    expires_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user_id: number;
}
