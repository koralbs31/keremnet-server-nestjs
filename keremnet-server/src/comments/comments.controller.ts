import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './comment.dto/comment.dto';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.createComment(dto);
  }

  @Get(':postId')
  getByPost(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPost(postId);
  }
}
