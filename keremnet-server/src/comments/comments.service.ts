/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity/comment.entity';
import { CreateCommentDto } from './comment.dto/comment.dto';
import { User } from '../users/user.entity';
import { Post } from '../posts/posts.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<Comment> {
    const user = await this.userRepo.findOne({ where: { uid: dto.authorUid } });
    const post = await this.postRepo.findOne({ where: { id: dto.postId } });
    if (!user || !post) throw new NotFoundException();

    const comment = this.commentRepo.create({ text: dto.text, author: user, post });
    return this.commentRepo.save(comment);
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });
  }
}
