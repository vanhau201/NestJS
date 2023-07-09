import { IsNotEmpty, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @Transform((username) => username.value.toLowerCase())
  username: string;
  @IsNotEmpty()
  @Length(4)
  password: string;
}
