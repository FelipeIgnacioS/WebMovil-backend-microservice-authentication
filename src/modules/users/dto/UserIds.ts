import { ArrayNotEmpty, IsArray, IsInt, IsNumber, MinLength } from 'class-validator';

export class UsersIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  userIds: number[];
}

