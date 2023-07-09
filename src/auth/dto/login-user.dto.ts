import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginUserDto {
  @IsNotEmpty()
  @Transform((userName) => userName.value.toLowerCase())
  userName: string;
  @IsNotEmpty()
  password: string;
}
