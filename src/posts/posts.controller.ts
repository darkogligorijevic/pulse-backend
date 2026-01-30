import { Body, Controller, Delete, Get, Param, Post, Req, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    // Create post
    @Post()
    @ApiOperation({ summary: 'Create post' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename:(req, file, cb) => {
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `${unique}${extname(file.originalname)}`);
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
        description: { type: 'string' },
        files: {
            type: 'array',
            items: {
            type: 'string',
            format: 'binary',
            },
        },
        },
    },
    })
    create(
        @Request() req, 
        @UploadedFiles() files: Express.Multer.File[], 
        @Body() dto: CreatePostDto
    ) {
        console.log(req.user.userId, files, dto)
        return this.postsService.create(req.user.userId, files, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete post' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') postId: number, @Request() req) {
        return this.postsService.remove(postId, req.user.userId);
    }

    @Post(':id/like')
    @ApiOperation({ summary: 'Like the post' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    like(@Param('id') postId: number, @Request() req) {
        return this.postsService.like(postId, req.user.userId);
    }

    @Delete('likes/:likeId')
    @ApiOperation({ summary: 'Dislike the post' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    dislike(@Param('likeId') likeId: number, @Request() req) {
        return this.postsService.dislike(likeId, req.user.userId);
    }

    @Post(':id/comment')
    @ApiOperation({ summary: 'Comment on the post' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    comment(@Param('id') postId: number, @Request() req, @Body() dto: CreateCommentDto) {
        return this.postsService.comment(postId, req.user.userId, dto);
    }

    @Delete('comments/:commentId')
    @ApiOperation({ summary: 'Delete comment on the post' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    removeComment(@Param('commentId') commentId: number, @Request() req) {
        return this.postsService.removeComment(commentId, req.user.userId);
    }

    @Get(':id/likes')
    getNumberOfLikes(@Param('id') postId: number) {
        return this.postsService.getNumberOfLikes(postId);
    }

    @Get(':id/comments')
    getNumberOfComments(@Param('id') postId: number) {
        return this.postsService.getNumberOfComments(postId);
    }

    @Get('user/:userId')
    getAllPostsByUserId(@Param('userId') userId: number) {
        return this.postsService.getAllPostsByUserId(userId);
    }

    @Get(':id/user/:userId')
    getPostByUserId(@Param('id') postId: number, @Param('userId') userId: number) {
        return this.postsService.getPostByUserId(postId, userId);
    }
}
