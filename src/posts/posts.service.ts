import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostComment } from './entities/post-comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { PostMedia } from './entities/post-media.entity';

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

    

}
