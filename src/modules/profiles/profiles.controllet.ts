import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProfileService } from './profiles.service';
import { updateProfileDto } from './dto/updateProfileDto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  async getProfile(@Param('userId') userId: number) {
    return await this.profileService.findByUserId(userId);
  }

  @Put(':userId')
  async updateProfile(@Param('userId') userId: number, @Body() updateProfileDto: updateProfileDto) {
    return await this.profileService.update(userId, updateProfileDto);
  }
}
