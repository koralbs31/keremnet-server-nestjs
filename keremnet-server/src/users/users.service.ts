/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './users.dto';

export interface User {
  uid: string;
  username: string;
  email?: string;
  password?: string;
  profilePicFileName: string;
}

@Injectable()
export class UsersService {
  private usersMap: Map<string, User> = new Map();

  getUsers(): User[] {
    return Array.from(this.usersMap.values());
  }

  getUserByUid(uid: string): User {
    const user = this.usersMap.get(uid);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  updateUser(uid: string, updateData: UpdateUserDto): User {
    const user = this.getUserByUid(uid);
    if (updateData.username) user.username = updateData.username;
    if (updateData.profilePicFileName)
      user.profilePicFileName = updateData.profilePicFileName;
    this.usersMap.set(uid, user);
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return Array.from(this.usersMap.values()).find((user) => user.email === email);
  }

  async addUser(userData: CreateUserDto): Promise<User> {
    if (this.findUserByEmail(userData.email)) {
      throw new BadRequestException('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const uid = Date.now().toString();

    const newUser: User = {
      uid,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      profilePicFileName: 'default.png',
    };

    this.usersMap.set(uid, newUser);
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = this.findUserByEmail(email);
    if (!user) throw new BadRequestException('Invalid email or password');

    const validPassword = await bcrypt.compare(password, user.password ?? '');
    if (!validPassword) throw new BadRequestException('Invalid email or password');

    return user;
  }
}
