import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('feeds')
export class FeedsController {
    constructor(
        private feedsService: FeedsService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get feed' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    getFeed(@Request() req, @Query('page') page=1) {
        return this.feedsService.getFeed(req.user.userId, Number(page));
    }
}
