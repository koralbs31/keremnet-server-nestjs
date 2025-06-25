/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrUpdatePostDto } from './post.dto';
import * as fs from 'fs';
import * as path from 'path';

export interface Post extends CreateOrUpdatePostDto {
  id: string;
  publishedAt: string;
}

@Injectable()
export class PostsService {
  private posts: Post[] = [];

  constructor() {
    this.loadPostsFromJson();
  }

  private loadPostsFromJson() {
    const filePath = path.join(__dirname, '..', '..', 'public', 'posts.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    this.posts = JSON.parse(data);
  }

  getPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: string): Post {
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  addPost(body: CreateOrUpdatePostDto): Post {
    const newPost: Post = {
      id: uuidv4(),
      title: body.title,
      author: body.author,
      content: body.content,
      publishedAt: new Date().toISOString(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  deletePost(id: string) {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('Post not found');

    this.posts.splice(index, 1);
    return { message: 'Post deleted successfully' };
  }

  updatePost(id: string, body: CreateOrUpdatePostDto): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('Post not found');

    const updatedPost: Post = {
      ...this.posts[index],
      ...body,
    };

    this.posts[index] = updatedPost;
    return updatedPost;
  }
}
