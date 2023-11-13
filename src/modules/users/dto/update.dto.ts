import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {

    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
