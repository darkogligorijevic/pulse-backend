import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: 'Get all users'})
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiOperation({ summary: 'Get me' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req) {
        console.log('REQ.USER:', req.user, 'TYPE:', typeof req.user?.userId);
        return this.usersService.findById(req.user.userId);
    }

    @ApiOperation({summary: 'Get user'})
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findById(id);
    }

    @ApiOperation({ summary: 'Update me' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateMe(@Request() req, @Body() dto: UpdateUserDto) {
        return this.usersService.update(req.user.userId, dto);
    }

    @ApiOperation({ summary: 'Change visibility from private to public profile or vice versa' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    @Patch('change-visibility')
    changeVisibility(@Request() req) {
        return this.usersService.changeVisibility(req.user.userId);
    }

    @ApiOperation({ summary: 'Delete me' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    @Delete('me')
    deleteMe(@Request() req) {
        return this.usersService.remove(req.user.userId);
    }

}
