import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { FollowsModule } from 'src/follows/follows.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => FollowsModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
