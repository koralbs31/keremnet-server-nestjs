import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { PostsService, PostBody } from './posts.service';

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

  @Post('add')
  addPost(@Body() body: PostBody) {
    return this.postsService.addPost(body);
  }

  @Delete('delete/:author/:title')
  deletePost(@Param('author') author: string, @Param('title') title: string) {
    return this.postsService.deletePost(author, title);
  }

  @Put('update/:author/:title')
  updatePost(
    @Param('author') author: string,
    @Param('title') title: string,
    @Body() body: PostBody,
  ) {
    return this.postsService.updatePost(author, title, body);
  }
}
