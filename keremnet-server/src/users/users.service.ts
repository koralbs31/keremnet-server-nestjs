/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface User {
  uid: string;
  username: string;
  email?: string;
  password?: string;
  profilePicFileName: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
  ];

  getUsers() {
    return this.users;
  }

  getUserByUid(uid: string): User {
    const user = this.users.find((u) => u.uid === uid);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  updateUser(uid: string, updateData: Partial<Omit<User, 'uid'>>) {
    const user = this.getUserByUid(uid);
    if (updateData.username) user.username = updateData.username;
    if (updateData.profilePicFileName)
      user.profilePicFileName = updateData.profilePicFileName;
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  async addUser(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    if (this.findUserByEmail(userData.email)) {
      throw new BadRequestException('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser: User = {
      uid: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      profilePicFileName: 'default.png',
    };
    this.users.push(newUser);
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
