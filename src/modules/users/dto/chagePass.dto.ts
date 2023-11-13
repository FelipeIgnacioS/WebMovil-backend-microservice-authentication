import { MinLength, IsNotEmpty, IsString } from "class-validator";

export class ChangePassword{

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword: string;
}