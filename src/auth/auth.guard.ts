import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type PayloadType = {
  id: string;
  updateToken: string;
  username: string;
  role: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const verify = await this.jwtService.verifyAsync<PayloadType>(token, {
        secret: this.configService.get('SECRET'),
      });
      console.log(roles);
      console.log(verify.role);
      console.log(roles.find((e) => e === verify.role));
      if (roles.find((e) => e === verify.role)) {
        return true;
      }
    } catch (err) {
      throw new UnauthorizedException();
    }

    return false;
  }

  private extractToken(request: Request) {
    const [type, token] = request.headers.authorization
      ? request.headers.authorization.split(' ')
      : [];
    return type === 'Bearer' ? token : undefined;
  }
}
