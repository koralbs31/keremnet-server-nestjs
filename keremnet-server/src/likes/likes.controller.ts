import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './like.dto/like.dto';

@Controller('api/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  like(@Body() dto: CreateLikeDto) {
    return this.likesService.likePost(dto);
  }

  @Get(':postId')
  getByPost(@Param('postId') postId: string) {
    return this.likesService.getLikesByPost(postId);
  }
}
