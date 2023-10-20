import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' }) //nombre igual al de la columna en la tabla
  user: User;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'text' })
  name_: string;

  @Column({ type: 'text', nullable: true })
  nickname: string;

  @Column({ type: 'text', nullable: true })
  job_title: string;

  @Column({ type: 'text', nullable: true })
  organization: string;

  @Column({ type: 'text', nullable: true })
  ubication: string;

  @Column({ type: 'text', nullable: true })
  phone: string;
}
