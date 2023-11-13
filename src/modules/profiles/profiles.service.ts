import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../infrastructure/database/entities/profile.entity';
import { updateProfileDto } from './dto/updateProfileDto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async findByUserId(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException(`Profile for user with id ${userId} not found.`);
    }
    return profile;
  }

  async update(userId: number, updateProfileDto: updateProfileDto): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    const updatedProfile = await this.profileRepository.save({
      ...profile,
      ...updateProfileDto,
    });
    return updatedProfile;
  }
}
