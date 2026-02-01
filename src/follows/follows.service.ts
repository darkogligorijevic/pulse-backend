import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { FollowRequest } from './entities/follow-request.entity';

@Injectable()
export class FollowsService {
    constructor(
        @InjectRepository(Follow)
        private followsRepository: Repository<Follow>,

        @InjectRepository(FollowRequest)
        private followRequestsRepository: Repository<FollowRequest>,

        private usersService: UsersService
    ) {}


    // follow logic
    async followRequest(userId: number, targetUserId: number) {
        if (userId === targetUserId) throw new BadRequestException("You can't follow  yourself!");
        
        const me = await this.usersService.findById(userId);
        const target = await this.usersService.findById(targetUserId);
        if (!me || !target) throw new NotFoundException();

        if (target.isPrivate) {
            try {
                await this.followRequestsRepository.save({
                    fromUserId: userId,
                    toUserId: targetUserId
                });
            } catch (e) {
                console.error(e);
                throw new BadRequestException('Request already sent!');
            }

            return { message: "Follow request sent" };
        } 

        const follow = this.followsRepository.create({
            follower: me,
            following: target
        });

        try {
            await this.followsRepository.save(follow);
        } catch (e) {
            console.error(e);
            throw new BadRequestException("Already following!");
        }

        return { message: `${me.username} started following ${target.username}` };
    }

    // accept follow request
    async acceptFollowRequest(requestId: number, userId: number) {
        const request = await this.followRequestsRepository.findOne({ 
            where: { id: requestId } 
        });

        if (!request) throw new NotFoundException();

        if (request.toUserId !== userId) throw new UnauthorizedException("You can't accept someone else's requests!");

        try {
            await this.followsRepository.save({
                followerId: request.fromUserId,
                followingId: request.toUserId
            });
        } catch (e) {
            console.error(e);
            throw new BadRequestException('Already following');
        }

        await this.followRequestsRepository.delete({ 
            id: requestId
        });

        return { message: 'Request accepted!' };
    }


    // decline follow request
    async rejectFollowRequest(requestId: number, userId: number) {
        const request = await this.followRequestsRepository.findOne({
            where: { id: requestId }
        });

        if (!request) throw new NotFoundException();

        if (request.toUserId !== userId) throw new UnauthorizedException("You cannot decline someon else's request!");

        await this.followRequestsRepository.delete({ 
            id: requestId
        });

        return { message: 'Request was rejected!' };
    }

    // check if Me is following specific user
    async isFollowing(userId: number, targetUserId: number) {
        return this.followsRepository.exists({
            where: {followerId: userId, followingId: targetUserId}
        });
    }

    // unfollow logic
    async unfollowOrCancel(userId: number, targetUserId: number) {
        const unfollow = await this.followsRepository.delete({
            followerId: userId,
            followingId: targetUserId
        });

        if (unfollow.affected && unfollow.affected > 0) {
            return { message: 'Unfollowed!' };
        }

        const cancel = await this.followRequestsRepository.delete({
            fromUserId: userId,
            toUserId: targetUserId
        });

        if (cancel.affected && cancel.affected > 0) {
            return { message: 'Request canceled!' };
        }

        throw new NotFoundException('Nothing to unfollow/cancel!');
    }

    // following status
    async getFollowStatus(userId: number, targetUserId: number) {
        const following = await this.followsRepository.exists({ 
            where: { followerId: userId, followingId: targetUserId }
        });

        if (following) return { status: 'following' };

        const request = await this.followRequestsRepository.exists({
            where: { fromUserId: userId, toUserId: targetUserId }
        });

        if (request) return { status: 'requested' };

        return { status: 'none' };

    }

    // can view user
    async assertCanViewUser(viewerId: number, targetUserId: number) {
        const target = await this.usersService.findById(targetUserId);
        if (!target) throw new NotFoundException();

        if (viewerId === targetUserId) return;

        if (!target.isPrivate) return;

        const follows = await this.followsRepository.exists({
            where: { followerId: viewerId, followingId: targetUserId }
        });

        if (!follows) throw new ForbiddenException('This profile is private!');
    }

    async getFollowers(viewerId: number, targetUserId: number) {
        await this.assertCanViewUser(viewerId, targetUserId)
        return await this.followsRepository.find({ 
            where: { followingId: targetUserId },
            relations: { follower: true } 
        });
    }

    async getFollowing(viewerId: number, targetUserId: number) {
        await this.assertCanViewUser(viewerId, targetUserId)
        return await this.followsRepository.find({ 
            where: { followerId: targetUserId },
            relations: { following: true } 
        });
    } 

    async getFollowerCount(targetUserId: number) {
        return await this.followsRepository.count({ 
            where: { followingId: targetUserId }  
        });
    }

    async getFollowingCount(targetUserId: number) {
        return await this.followsRepository.count({
            where: { followerId: targetUserId }
        });
    }
}
