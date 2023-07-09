import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDto {
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsNotEmpty()
  @Expose()
  updateToken: string;

  @IsNotEmpty()
  @Expose()
  name: string;

  @IsNotEmpty()
  @Expose()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Expose()
  role: string;
}
