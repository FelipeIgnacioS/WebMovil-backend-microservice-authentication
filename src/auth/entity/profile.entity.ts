import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity'; // Asegúrate de ajustar la ruta a donde se encuentre tu entidad User

@Entity('profiles') // Sugerencia: para mantener una nomenclatura similar a 'users'
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' }) 
  user: User; 

  @Column()
  userId: number;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text', nullable: true })
  nickname: string;

  @Column({ type: 'text', nullable: true })
  jobTitle: string;

  @Column({ type: 'text', nullable: true })
  organization: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  contact: string;
}
