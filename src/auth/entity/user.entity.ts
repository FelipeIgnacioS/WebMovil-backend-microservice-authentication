import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity'; // Asegúrate de ajustar la ruta

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @OneToOne(() => Profile, profile => profile.user)
    @JoinColumn({ name: 'profileId' })
    profile: Profile;
}