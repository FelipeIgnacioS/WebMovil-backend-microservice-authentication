import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('profiles')
  export class Profile {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    nickname: string;
  
    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn({ name: 'user_id'})
    user: User;
  
    @Column({ nullable: true })
    first_name: string;
  
    @Column({ nullable: true })
    last_name: string;
  
    @Column({ nullable: true })
    job_position: string;
  
    @Column({ nullable: true })
    location: string;
  
    @Column({ nullable: true, type: 'text' })
    profile_picture: string;
  
    @Column({ nullable: true })
    contact: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  }
  