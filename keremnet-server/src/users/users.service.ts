/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async getUserByUid(uid: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { uid } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  async updateUser(uid: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.getUserByUid(uid);

    if (updateData.username && updateData.username !== user.username) {
      const existing = await this.findUserByUsername(updateData.username);
      if (existing && existing.uid !== uid) {
        throw new BadRequestException('Username already taken');
      }
      user.username = updateData.username;
    }

    if (updateData.profilePicFileName) {
      user.profilePicFileName = updateData.profilePicFileName;
    }

    return this.userRepo.save(user);
  }

  async addUser(userData: CreateUserDto): Promise<User> {
    const emailExists = await this.findUserByEmail(userData.email);
    if (emailExists) throw new BadRequestException('User already exists with this email');

    const usernameExists = await this.findUserByUsername(userData.username);
    if (usernameExists) throw new BadRequestException('Username already taken');

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = this.userRepo.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      profilePicFileName: 'default.png',
    });

    return this.userRepo.save(newUser);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) throw new BadRequestException('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password ?? '');
    if (!valid) throw new BadRequestException('Invalid email or password');

    return user;
  }
}
