import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity/like.entity';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { User } from '../users/user.entity';
import { Post } from '../posts/posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, User, Post])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
