import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
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

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Post()
  addPost(@Body() body: CreateOrUpdatePostDto) {
    return this.postsService.addPost(body);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: CreateOrUpdatePostDto) {
    return this.postsService.updatePost(id, body);
  }
}
