import { Module } from '@nestjs/common';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { UsersModule } from 'src/users/users.module';
import { FollowRequest } from './entities/follow-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow, FollowRequest]),
    UsersModule
  ],
  controllers: [FollowsController],
  providers: [FollowsService]
})
export class FollowsModule {}
