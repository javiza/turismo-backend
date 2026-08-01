import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { Roles } from '../common/decorators/roles.decorator';

import { Role } from '../common/constants/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  create(
    @Body()
    dto: CreateUserDto,
  ) {
    return this.usersService.create(
      dto,
    );
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(
    Role.SUPER_ADMIN,
    Role.ADMIN,
  )
  findAll(@Query('q') q?: string) {
    return this.usersService.findAll(q);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(
    Role.SUPER_ADMIN,
    Role.ADMIN,
  )
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.usersService.findOne(
      +id,
    );
  }
  @Patch(':id/deactivate')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
deactivate(
  @Param('id')
  id: string,
) {
  return this.usersService.deactivate(
    +id,
  );
}

@Patch(':id/reactivate')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
reactivate(@Param('id') id: string) {
  return this.usersService.reactivate(+id);
}
}