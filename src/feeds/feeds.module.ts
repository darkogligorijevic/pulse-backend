import { forwardRef, Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { FollowsModule } from 'src/follows/follows.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => FollowsModule),
    UsersModule
  ],
  providers: [FeedsService],
  controllers: [FeedsController]
})
export class FeedsModule {}
