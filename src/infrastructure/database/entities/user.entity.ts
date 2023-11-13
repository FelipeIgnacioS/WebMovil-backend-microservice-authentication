import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { IsEmail, MinLength } from 'class-validator';
  import { Profile } from './profile.entity';
  import { Token } from './token.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    @IsEmail()
    email: string;
  
    @Column()
    @MinLength(8)
    password_hash: string;
  
    @Column({ default: true })
    is_active: boolean;
  
    @Column({ default: false })
    is_verified: boolean;
  
    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile;
  
    @OneToOne(() => Token, (token) => token.user)
    token: Token[];
  }
  