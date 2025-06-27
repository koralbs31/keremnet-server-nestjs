import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity/like.entity';
import { User } from '../users/user.entity';
import { Post } from '../posts/posts.entity';
import { CreateLikeDto } from './like.dto/like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async likePost(dto: CreateLikeDto): Promise<Like> {
    const user = await this.userRepo.findOne({ where: { uid: dto.userUid } });
    const post = await this.postRepo.findOne({ where: { id: dto.postId } });
    if (!user || !post) throw new NotFoundException();

    const existing = await this.likeRepo.findOne({ where: { user, post } });
    if (existing) return existing;

    const like = this.likeRepo.create({ user, post });
    return this.likeRepo.save(like);
  }

  async getLikesByPost(postId: string): Promise<Like[]> {
    return this.likeRepo.find({
      where: { post: { id: postId } },
      order: { likedAt: 'DESC' },
      relations: ['user'],
    });
  }
}
