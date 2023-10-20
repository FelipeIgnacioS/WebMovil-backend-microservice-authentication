import { User } from '../entity/user.entity';

export class CreateProfileDto {
  user: User;
  image?: string;
  name_: string;
  nickname?: string;
  job_title?: string;
  organization?: string;
  ubication?: string;
  phone?: string;
}