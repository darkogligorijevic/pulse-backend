import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostComment } from './entities/post-comment.entity';
import { PostLike } from './entities/post-like.entity';
import { UsersModule } from 'src/users/users.module';
import { PostMedia } from './entities/post-media.entity';
import { FollowsModule } from 'src/follows/follows.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostComment, PostLike, PostMedia]),
    UsersModule,
    FollowsModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
