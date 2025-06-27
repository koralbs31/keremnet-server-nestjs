/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateOrUpdatePostDto } from './post.dto';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get('user/:username')
  getPostsByUser(@Param('username') username: string) {
    return this.postsService.getPostsByUsername(username);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Post()
  addPost(@Body() body: CreateOrUpdatePostDto & { author: string }) {
    if (!body.author) {
      throw new BadRequestException('Author is required');
    }
    return this.postsService.addPost(body);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @Body('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.postsService.deletePost(id, userId);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() body: CreateOrUpdatePostDto & { userId?: string },
  ) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.postsService.updatePost(id, body, body.userId);
  }
}
