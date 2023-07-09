import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type PayloadType = {
  id: string;
  updateToken: string;
  username: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      username: loginUserDto.userName,
    });
    if (!user) {
      throw new HttpException(
        'Username or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Username or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      id: user.id,
      updateToken: user.updateToken,
      username: user.username,
      role: user.role,
    };
    return this.generateToken(payload);
  }

  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verifyAsync<PayloadType>(
        refreshToken,
        {
          secret: this.configService.get('SECRET'),
        },
      );

      const user = await this.userRepository.findOneBy({
        id: verify.id,
        updateToken: verify.updateToken,
        refreshToken: refreshToken,
      });
      if (user) {
        return this.generateToken({
          id: user.id,
          updateToken: user.updateToken,
          role: user.role,
          username: user.username,
        });
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // generate asscess token
  private async generateToken(payload: PayloadType) {
    const asscessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('SECRET'),
      expiresIn: this.configService.get('EXPIRES_IN_REFRESH_TOKEN'),
    });

    await this.userRepository.update(
      {
        id: payload.id,
        updateToken: payload.updateToken,
      },
      {
        refreshToken: refreshToken,
      },
    );

    return { asscessToken, refreshToken };
  }
}
