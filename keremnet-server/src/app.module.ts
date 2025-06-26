/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [UsersModule, PostsModule, ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), "public"),
    serveRoot: '/public',
    serveStaticOptions: {
      index: false
    }

  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
