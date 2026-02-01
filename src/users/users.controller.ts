import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get()
    @ApiOperation({summary: 'Get all users'})
    findAll() {
        return this.usersService.findAll();
    }

    @Get('me')
    @ApiOperation({ summary: 'Get me' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    getMe(@Request() req) {
        return this.usersService.findById(req.user.userId);
    }

    @Get(':targetId')
    @ApiOperation({summary: 'Get user'})
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req, @Param('targetId') targetId: number) {
        return this.usersService.getProfile(req.user.userId, targetId);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update me' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    updateMe(@Request() req, @Body() dto: UpdateUserDto) {
        return this.usersService.update(req.user.userId, dto);
    }

    @Patch('change-visibility')
    @ApiOperation({ summary: 'Change visibility from private to public profile or vice versa' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    changeVisibility(@Request() req) {
        return this.usersService.changeVisibility(req.user.userId);
    }

    @Delete('me')
    @ApiOperation({ summary: 'Delete me' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    deleteMe(@Request() req) {
        return this.usersService.remove(req.user.userId);
    }

}
