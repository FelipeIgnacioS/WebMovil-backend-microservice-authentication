export class CreateProfileDto {
  userId: number;
  image?: string;
  firstName: string;
  nickname?: string;
  jobTitle?: string;
  organization?: string;
  location?: string;
  contact?: string;
}