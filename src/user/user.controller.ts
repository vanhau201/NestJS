import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { EnumRoles } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  create(@Body() userCreate: CreateUserDto) {
    return this.userService.create(userCreate);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(EnumRoles.ADMIN, EnumRoles.PM)
  getAll() {
    return 'Hello';
  }
}
