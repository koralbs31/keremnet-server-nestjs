/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Post } from './posts/posts.entity';

@Module({
  imports: [UsersModule, PostsModule, ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), "public"),
    serveRoot: '/public',
    serveStaticOptions: {
      index: false
    }

  }), TypeOrmModule.forRoot({
     type: 'mysql', 
     host: 'localhost',
     port: 3306,
     username: 'root',
     password: "215100009",
     database: 'myDB',
     entities: [User, Post],
     synchronize: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
