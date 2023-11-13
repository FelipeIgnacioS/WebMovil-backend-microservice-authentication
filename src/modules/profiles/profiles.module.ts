// src/modules/profiles/profiles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profiles.service';
import { ProfileController } from './profiles.controllet';
import { Profile } from '../../infrastructure/database/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfilesModule {}
