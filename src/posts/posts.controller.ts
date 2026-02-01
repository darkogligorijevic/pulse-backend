import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EditPostDto } from './dto/edit-post.dto';
import { EditCommentDto } from './dto/edit-comment.dto';

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

    @Patch(':id')
    @ApiOperation({ summary: 'Edit post' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    editPost(@Param('id') postId: number, @Request() req, @Body() dto: EditPostDto) {
        return this.postsService.edit(postId, req.user.userId, dto);
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

    
    @Patch('comments/:commentId')
    @ApiOperation({ summary: 'Edit comment' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard)
    editComment(@Param('commentId') commentId: number, @Request() req, @Body() dto: EditCommentDto) {
        return this.postsService.editComment(commentId, req.user.userId, dto);
    }

    @Get(':id/likes-number')
    @ApiOperation({ summary: 'Total number of likes on one post' })
    getNumberOfLikes(@Param('id') postId: number, @Request() req) {
        return this.postsService.getNumberOfLikes(postId, req.user.userId);
    }

    @Get(':id/comments-number')
    @ApiOperation({ summary: 'Total number of comments on one post' })
    getNumberOfComments(@Param('id') postId: number, @Request() req) {
        return this.postsService.getNumberOfComments(postId, req.user.userId);
    }

    @Get('user/:targetId')
    @ApiOperation({ summary: 'Get all posts by one user' })
    getAllPostsByUserId(@Request() req, @Param('targetId') targetId: number) {
        return this.postsService.getAllPostsByUserId(req.user.userId, targetId);
    }

    @Get(':id/user/:targetId')
    @ApiOperation({ summary: 'Get one post by one user' })
    getPostByUserId(@Param('id') postId: number, @Request() req, @Param('targetId') targetId: number) {
        return this.postsService.getPostByUserId(postId, req.user.userId, targetId);
    }

    @Get(':id/likes')
    @ApiOperation({ summary: 'Get all like for one post' })
    getAllPostLikes(@Param('id') postId: number, @Request() req) {
        return this.postsService.getAllPostLikes(postId, req.user.userId);
    }

    @Get(':id/comments')
    @ApiOperation({ summary: 'Get all comments for one post' })
    getAllPostComments(@Param('id') postId: number, @Request() req) {
        return this.postsService.getAllPostComments(postId, req.user.userId);
    }
}
