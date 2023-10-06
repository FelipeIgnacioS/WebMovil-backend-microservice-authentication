import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('password_resets')
export class PasswordReset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column('timestamp')
    expires_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user_id: number;
}
