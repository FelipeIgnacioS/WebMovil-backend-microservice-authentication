import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsString()
    nickname: string;

    @IsOptional()
    @IsString()
    first_name: string;

    @IsOptional()
    @IsString()
    last_name: string;

    @IsOptional()
    @IsString()
    job_position: string;

    @IsOptional()
    @IsString()
    location: string;

    @IsOptional()
    @IsString()
    profile_picture: string;

    @IsOptional()
    @IsString()
    contact: string;
}
