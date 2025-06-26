/* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable prettier/prettier */
import { UsersService } from './users.service';
import {Test} from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
    providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addUser', () => {
    it('should add a new user', async () => {
      const user = await service.addUser({
        username: 'test',
        email: 'test@gmail.com',
        password: 'password123',
      });

      expect(user).toHaveProperty('uid');
      expect(user.username).toBe('test');
      expect(user.email).toBe('test@gmail.com');
      expect(user.password).not.toBe('password123');
      expect(service.getUsers()).toHaveLength(1);
    });

    it('should throw if user email already exists', async () => {
      await service.addUser({
        username: 'test',
        email: 'test@gmail.com',
        password: 'pass',
      });

      await expect(
        service.addUser({
          username: 'test',
          email: 'test@gmail.com',
          password: 'another',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUser', () => {
    it('should validate a user with correct password', async () => {
      const user = await service.addUser({
        username: 'ran',
        email: 'ran@gmail.com',
        password: 'secret',
      });

      const validatedUser = await service.validateUser('ran@gmail.com', 'secret');
      expect(validatedUser.uid).toBe(user.uid);
    });

    it('should throw for invalid email', async () => {
      await expect(
        service.validateUser('eden@gmail.com', 'test'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw for incorrect password', async () => {
      await service.addUser({
        username: 'lazer',
        email: 'lazer@gmail.com',
        password: 'goodpass',
      });

      await expect(
        service.validateUser('lazer@gmail.com', 'wrongpass'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserByUid', () => {
    it('should return user by uid', async () => {
      const user = await service.addUser({
        username: 'uidy',
        email: 'uidy@gmail.com',
        password: '123',
      });

      const fetched = service.getUserByUid(user.uid);
      expect(fetched.email).toBe('uidy@gmail.com');
    });

    it('should throw if uid not found', () => {
      expect(() => service.getUserByUid('nonexistent')).toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update username and profilePicFileName', async () => {
      const user = await service.addUser({
        username: 'old',
        email: 'up@gmail.com',
        password: 'pass',
      });

      const updated = service.updateUser(user.uid, {
        username: 'newname',
        profilePicFileName: 'newpic.png',
      });

      expect(updated.username).toBe('newname');
      expect(updated.profilePicFileName).toBe('newpic.png');
    });
  });
});
