/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';

interface UserResponse {
  id: string;
  username: string;
  email?: string;
}

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return { users: this.usersService.getUsers() };
  }

  @Get(':uid')
  getUserByUid(@Param('uid') uid: string) {
    const user = this.usersService.getUserByUid(uid);
    return { user };
  }

  @Put(':uid')
  updateUser(@Param('uid') uid: string, @Body() updateData: Partial<Omit<UserResponse, 'id'>>) {
    const user = this.usersService.updateUser(uid, updateData);
    return { user };
  }

  @Post('register')
  async register(
    @Body()
    body: { username: string; email: string; password: string },
  ): Promise<{ success: boolean; message: string; user: UserResponse }> {
    const { username, email, password } = body;

    if (!username || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    const newUser = await this.usersService.addUser({ username, email, password });

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.uid,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }

  @Post('login')
  async login(
    @Body()
    body: { email: string; password: string },
  ): Promise<{ success: boolean; message: string; user: UserResponse }> {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.validateUser(email, password);

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.uid,
        username: user.username,
        email: user.email,
      },
    };
  }

  @Get('user-details')
  getUserDetails() {
    const users = this.usersService.getUsers().map((u) => ({
      id: u.uid,
      username: u.username,
      email: u.email,
      profilePicFileName: u.profilePicFileName,
    }));
    return {
      success: true,
      users,
    };
  }

  @Post()
  async createUser(
    @Body()
    body: { username: string; email: string; password: string },
  ) {
    const newUser = await this.usersService.addUser(body);
    return { user: newUser };
  }
}
