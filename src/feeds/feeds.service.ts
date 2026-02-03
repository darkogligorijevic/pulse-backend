import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowsService } from 'src/follows/follows.service';
import { Post } from 'src/posts/entities/post.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FeedsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,

        private followsService: FollowsService
    ) {}

    async getFeed(userId: number, page=1, limit=10) {
        const followingIds = await this.followsService.getFollowingIds(userId);

        if (followingIds.length === 0) return [];

        return this.postsRepository.find({
            where: { userId: In(followingIds) },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
            relations: {
                user: true
            }
        })

    }
}
