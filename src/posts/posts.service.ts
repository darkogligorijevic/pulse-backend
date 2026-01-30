import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostComment } from './entities/post-comment.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { MediaType, PostMedia } from './entities/post-media.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,

        @InjectRepository(PostMedia)
        private postMediasRepository: Repository<PostMedia>,

        @InjectRepository(PostLike)
        private postLikesRepository: Repository<PostLike>,

        @InjectRepository(PostComment)
        private postCommentsRepository: Repository<PostComment>,

        private usersService: UsersService,
    ) {}

    async findById(id: number) {
        return await this.postsRepository.findOne({ 
            where: { id },
            relations: { user: true } 
        })
    }

    // create post logic
    async create(userId: number, files: Express.Multer.File[] , dto: CreatePostDto) {
        const post = await this.postsRepository.create({
            userId,
            description: dto.description,
            media: files.map((file, index) => ({
                type: file.mimetype.startsWith('video') ? MediaType.VIDEO : MediaType.IMAGE,
                url: `/uploads/${file.filename}`,
                order: index,
            })),
        })

        await this.postsRepository.save(post);
        return post;
    }

    // delete post 
    async remove(postId: number, userId: number) {
        const post = await this.findById(postId);
        const user = await this.usersService.findById(userId);
        
        if (!post || !user) throw new NotFoundException("Post or User don't exist!");

        if (post.userId !== user?.id) throw new UnauthorizedException("You can only delete your own posts!");

        // delete media from /uploads folder
        const medias = await this.postMediasRepository.find({ where: { postId } });

        for (const media of medias) {
            if (!media.url) continue;    
            if (!media.url.startsWith('/uploads')) continue;
    
            const absolute = path.join(process.cwd(), media.url.replace(/^\//, ''));
    
            try {
                if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
            } catch (e) {
                console.warn('Failed to delete file:', absolute, e);
            }
        }

        await this.postsRepository.remove(post);

        return { message: 'Post is removed!' }
    }


    // like post logic
    async like(postId: number, userId: number) {
        const post = await this.findById(postId);
        const user = await this.usersService.findById(userId);

        if (!post || !user) throw new NotFoundException("Post or User don't exist!");

        const existing = await this.postLikesRepository.findOne({ 
            where: { postId, userId }
         });

        if (existing) throw new BadRequestException('Already liked!');

        const like = await this.postLikesRepository.create({
            postId,
            userId
        });
        
        await this.postLikesRepository.save(like);


        return {message: `${user.username} liked ${post.user.username}'s post!`}
    }

    // dislike post logic
    async dislike(likeId: number, userId: number) {
        const likedPost = await this.postLikesRepository.findOne({ 
            where: { id: likeId }
        })

        if (!likedPost) throw new BadRequestException("You haven't liked this post!");
  
        if (likedPost.userId !== userId) throw new UnauthorizedException(); 

        await this.postLikesRepository.delete({ id: likeId, userId });

        return { message: 'Post is disliked!' }
    }

    // comment on post
    async comment(postId: number, userId: number, dto: CreateCommentDto) {
        const post = await this.findById(postId);
        const user = await this.usersService.findById(userId);

        if (!post || !user) throw new NotFoundException("Post or User don't exist!");

        const comment = await this.postCommentsRepository.create({
            postId,
            userId,
            comment: dto.comment
        });

        await this.postCommentsRepository.save(comment);
        return comment;
    }

    // delete comment
    async removeComment(commentId: number, userId: number) {
        const comment = await this.postCommentsRepository.findOne({ where: { id: commentId } });
        if (!comment) throw new NotFoundException("That comment doesn't exist!");

        if (comment.userId !== userId) throw new UnauthorizedException("You can only delete your comments!");

        await this.postCommentsRepository.delete({ id: commentId, userId });

        return {message: 'Comment is deleted!'}
    }

    // get number of likes
    async getNumberOfLikes(postId: number) : Promise<number> {
        return await this.postLikesRepository.count({ where: {postId} });
    }

    // get number or comments
    async getNumberOfComments(postId: number) : Promise<number> {
        return await this.postCommentsRepository.count({ where: { postId } });
    }

    // get all posts
    async getAllPostsByUserId(userId: number) {
        // later check if the profile is private and current user is not following -> don't show posts
        return await this.postsRepository.find({ where: { userId } });
    }

    // get post
    async getPostByUserId(postId: number, userId: number) {
        return this.postsRepository.findOne({ where: { id: postId, userId } });
    }

    // get all users that liked post

    // get all users that comment on the post

}
