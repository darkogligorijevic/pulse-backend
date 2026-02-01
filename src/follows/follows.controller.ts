import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('follows')
export class FollowsController {
    constructor(
        private followsService: FollowsService
    ) {}

    // make a follow request
    @Post('user/:targetUserId/follow')
    @ApiOperation({ summary: 'Make a follow request!' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    followRequest(@Request() req, @Param('targetUserId') targetUserId: number) {
        return this.followsService.followRequest(req.user.userId, targetUserId);
    }

    // make unfollow
    @Delete('user/:targetUserId/unfollow')
    @ApiOperation({ summary: 'Unfollow user!' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    unfollowOrCancel(@Request() req, @Param('targetUserId') targetUserId: number) {
        return this.followsService.unfollowOrCancel(req.user.userId, targetUserId);
    }

    // accept follow req
    @Post('request/:requestId/accept')
    @ApiOperation({ summary: 'Accept follow request!' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    acceptFollowRequest(@Param('requestId') requestId: number, @Request() req) {
        return this.followsService.acceptFollowRequest(requestId, req.user.userId);
    }

    // delete(reject) follow req
    @Delete('request/:requestId/reject')
    @ApiOperation({ summary: 'Reject follow request!' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    rejectFollowRequest(@Param('requestId') requestId: number, @Request() req) {
        return this.followsService.rejectFollowRequest(requestId, req.user.userId);
    }


    // check if me following user
    @Get('user/:targetUserId')
    @ApiOperation({ summary: 'Check if me following user' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    isFollowing(@Request() req, @Param('targetUserId') targetUserId: number) {
        return this.followsService.isFollowing(req.user.userId, targetUserId);
    }

    // get status (following, requested, none)
    @Get('user/:targetUserId/status')
    @ApiOperation({ summary: 'Get following status!' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    getFollowStatus(@Request() req, @Param('targetUserId') targetUserId: number) {
        return this.followsService.getFollowStatus(req.user.userId, targetUserId);
    }

    @Get('user/:targetUserId/followers')
    getFollowers(@Request() req, @Param('targetUserId') targetUserId: number) {
        return this.followsService.getFollowers(req.user.userId, targetUserId);
    }

    @Get('user/:targetUserId/following')
    getFollowing(@Request() req, @Param('targetUserId') targetUserId: number) {
        return this.followsService.getFollowing(req.user.userId, targetUserId);
    }

    @Get('user/:targetUserId/followers/count')
    getFollowerCount(@Param('targetUserId') targetUserId: number) {
        return this.followsService.getFollowerCount(targetUserId);
    }

    @Get('user/:targetUserId/following/count')
    getFollowingCount(@Param('targetUserId') targetUserId: number) {
        return this.followsService.getFollowingCount(targetUserId);
    }
}
