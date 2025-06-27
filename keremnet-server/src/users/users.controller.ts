/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  UploadedFile,
  Body,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { join } from 'path';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

interface UserResponse {
  id: string;
  username: string;
  email?: string;
}

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return { users };
  }

  @Get(':uid')
  async getUserByUid(@Param('uid') uid: string) {
    const user = await this.usersService.getUserByUid(uid);
    return { user };
  }

  @Put(':uid')
  async updateUser(
    @Param('uid') uid: string,
    @Body() updateData: Partial<Omit<UserResponse, 'id'> & { profilePicFileName?: string }>
  ) {
    const user = await this.usersService.updateUser(uid, updateData);
    return { user };
  }

  @Post('register')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const username = req.body.username;
          const uploadPath = join(process.cwd(), 'public', 'profile-pics', username);
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, 'profile.png');
        },
      }),
    }),
  )
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { username: string; email: string; password: string }
  ): Promise<{
    success: boolean;
    message: string;
    user: {
      id: string;
      username: string;
      email?: string;
      profilePicFileName: string;
    };
  }> {
    const { username, email, password } = body;

    if (!username || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    const profilePicFileName = file
      ? `profile-pics/${username}/profile.png`
      : 'default.png';

    const newUser = await this.usersService.addUser({
      username,
      email,
      password,
      profilePicFileName,
    });

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.uid,
        username: newUser.username,
        email: newUser.email,
        profilePicFileName: newUser.profilePicFileName,
      },
    };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
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
  async getUserDetails() {
    const users = await this.usersService.getUsers();
    return {
      success: true,
      users: users.map((u) => ({
        id: u.uid,
        username: u.username,
        email: u.email,
        profilePicFileName: u.profilePicFileName,
      })),
    };
  }

  @Post()
  async createUser(
    @Body() body: { username: string; email: string; password: string }
  ) {
    const newUser = await this.usersService.addUser(body);
    return { user: newUser };
  }
}

