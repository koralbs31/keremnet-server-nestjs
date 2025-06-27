/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdatePostDto } from './post.dto';
import { Post } from './posts.entity';
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
    return this.postRepo.find(); 
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
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

  async deletePost(id: string): Promise<{ message: string }> {
    const result = await this.postRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Post not found');
    return { message: 'Post deleted successfully' };
  }

  async updatePost(id: string, body: CreateOrUpdatePostDto): Promise<Post> {
    const post = await this.getPostById(id);

    post.title = body.title ?? post.title;
    post.content = body.content ?? post.content;

    return this.postRepo.save(post);
  }

  async getPostsByUsername(username: string): Promise<Post[]> {
    return this.postRepo.find({
      where: {
        user: {
          username,
        },
      },
    });
  }
}
