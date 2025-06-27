/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';
import { CreateOrUpdatePostDto } from './post.dto';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getPosts(): Promise<Post[]> {
    return this.postRepo.find({ relations: ['user', 'likes', 'comments'] });
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'likes', 'comments'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async addPost(body: CreateOrUpdatePostDto & { author: string }): Promise<Post> {
    const user = await this.userRepo.findOne({ where: { username: body.author } });
    if (!user) throw new NotFoundException('Author not found');

    const newPost = this.postRepo.create({
      title: body.title,
      content: body.content,
      publishedAt: new Date().toISOString(),
      user,
    });

    return this.postRepo.save(newPost);
  }

  async deletePost(id: string, userId: string): Promise<{ message: string }> {
    const post = await this.getPostById(id);
    if (post.user.uid !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.postRepo.remove(post);
    return { message: 'Post deleted successfully' };
  }

  async updatePost(id: string, body: CreateOrUpdatePostDto, userId: string): Promise<Post> {
    const post = await this.getPostById(id);
    if (post.user.uid !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    post.title = body.title ?? post.title;
    post.content = body.content ?? post.content;

    return this.postRepo.save(post);
  }

  async getPostsByUsername(username: string): Promise<Post[]> {
    return this.postRepo.find({
      where: { user: { username } },
      relations: ['user', 'likes', 'comments'],
    });
  }
}
