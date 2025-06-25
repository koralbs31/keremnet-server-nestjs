import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface PostBody {
  id?: string;
  title: string;
  author: string;
  publishedAt?: string;
  content: string;
}

@Injectable()
export class PostsService {
  private posts: PostBody[] = [
    {
      id: '1',
      title: 'first post',
      author: 'Admin',
      publishedAt: '2024-06-01',
      content: 'This is the first post.',
    },
    {
      id: '2',
      title: 'second post',
      author: 'koral steinberg',
      publishedAt: '2025-06-02',
      content: 'first hanich post.',
    },
    {
      id: '3',
      title: 'third post',
      author: 'Ran',
      publishedAt: '2025-06-03',
      content: 'Second hanich post',
    },
    {
      id: '4',
      title: 'forth post',
      author: 'Eden',
      publishedAt: '2025-06-08',
      content: 'third hanich post',
    },
    {
      id: '5',
      title: 'forth post',
      author: 'Eden',
      publishedAt: '2025-06-08',
      content: 'third hanich post',
    },
  ];

  getPosts(): PostBody[] {
    return this.posts;
  }

  getPostById(id: string): PostBody {
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  addPost(body: PostBody): PostBody {
    const newPost: PostBody = {
      id: uuidv4(),
      title: body.title,
      author: body.author,
      publishedAt: new Date().toISOString(),
      content: body.content,
    };
    this.posts.push(newPost);
    return newPost;
  }

  deletePost(author: string, title: string) {
    const index = this.posts.findIndex(
      (p) => p.author === author && p.title === title,
    );
    if (index === -1) throw new NotFoundException('Post not found');

    this.posts.splice(index, 1);
    return { message: 'Post deleted successfully', posts: this.posts };
  }

  updatePost(author: string, title: string, body: PostBody): PostBody {
    const index = this.posts.findIndex(
      (p) => p.author === author && p.title === title,
    );
    if (index === -1) throw new NotFoundException('Post not found');

    this.posts[index] = {
      ...this.posts[index],
      ...body,
      id: this.posts[index].id,
      publishedAt: this.posts[index].publishedAt,
    };
    return this.posts[index];
  }
}
