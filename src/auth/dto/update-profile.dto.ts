import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name_: string;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsString()
  @IsOptional()
  job_title: string;

  @IsString()
  @IsOptional()
  organization: string;

  @IsString()
  @IsOptional()
  ubication: string;

  @IsString()
  @IsOptional()
  phone: string;

}
