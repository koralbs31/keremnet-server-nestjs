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
  private postsMap: Map<string, Post> = new Map();

  constructor() {
    this.loadPostsFromJson();
  }

  private loadPostsFromJson() {
    const filePath = path.join(__dirname, '..', '..', 'public', 'posts.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const posts: Post[] = JSON.parse(data);
    for (const post of posts) {
      this.postsMap.set(post.id, post);
    }
  }

  getPosts(): Post[] {
    return Array.from(this.postsMap.values());
  }

  getPostById(id: string): Post {
    const post = this.postsMap.get(id);
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
    this.postsMap.set(newPost.id, newPost);
    return newPost;
  }

  deletePost(id: string) {
    const exists = this.postsMap.has(id);
    if (!exists) throw new NotFoundException('Post not found');

    this.postsMap.delete(id);
    return {
      message: 'Post deleted successfully',
      posts: this.getPosts(),
    };
  }

  updatePost(id: string, body: CreateOrUpdatePostDto): Post {
    const existing = this.postsMap.get(id);
    if (!existing) throw new NotFoundException('Post not found');

    const updatedPost: Post = {
      ...existing,
      ...body,
    };

    this.postsMap.set(id, updatedPost);
    return updatedPost;
  }
}
