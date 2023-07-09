import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { generateUpdateToken } from 'src/common/generate-update-token';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    protected userRepository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const hashPassword = await this.hashPassword(createUserDto.password);
      const user = await this.userRepository.save({
        ...createUserDto,
        updateToken: generateUpdateToken(),
        password: hashPassword,
      });
      return plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
