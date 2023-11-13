import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
import { User } from './user.entity';

  
  @Entity('tokens')
  export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;
  
    @ManyToOne(() => User, (user) => user.token)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column()
    type: string;
  
    @Column()
    expires_at: Date;
  }
  