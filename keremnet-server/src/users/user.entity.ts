/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../posts/posts.entity';
import { Comment } from '../comments/comment.entity/comment.entity';
import { Like } from '../likes/like.entity/like.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  profilePicFileName?: string;

  @OneToMany(() => Post, post => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.author, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Like, like => like.user, { cascade: true })
  likes: Like[];
}
