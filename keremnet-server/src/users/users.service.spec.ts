/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const usersArray: User[] = [];

  const mockRepo = {
    find: jest.fn().mockImplementation(() => Promise.resolve(usersArray)),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn().mockImplementation((user) => {
      usersArray.push(user);
      return Promise.resolve(user);
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));

    usersArray.length = 0;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addUser', () => {
    it('should add a new user', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockImplementation((data) => ({ uid: '1', ...data }));

      const user = await service.addUser({
        username: 'test',
        email: 'test@example.com',
        password: 'pass123',
      });

      expect(user.username).toBe('test');
      expect(user.email).toBe('test@example.com');
      expect(user.password).not.toBe('pass123'); 
    });

    it('should throw if email exists', async () => {
      mockRepo.findOne.mockResolvedValueOnce({ email: 'test@example.com' });

      await expect(
        service.addUser({
          username: 'abc',
          email: 'test@example.com',
          password: 'pass123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUser', () => {
    it('should validate correct credentials', async () => {
      const hashed = await bcrypt.hash('secret', 10);
      mockRepo.findOne.mockResolvedValueOnce({
        uid: '1',
        email: 'test@gmail.com',
        password: hashed,
      });

      const user = await service.validateUser('test@gmail.com', 'secret');
      expect(user.uid).toBe('1');
    });

    it('should throw for invalid email', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(
        service.validateUser('nope@email.com', '123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserByUid', () => {
    it('should return user if found', async () => {
      mockRepo.findOne.mockResolvedValue({ uid: '123', email: 'a@a.com' });
      const user = await service.getUserByUid('123');
      expect(user.uid).toBe('123');
    });

    it('should throw if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.getUserByUid('no')).rejects.toThrow(NotFoundException);
    });
  });
});
