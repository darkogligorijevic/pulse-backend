import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('post_likes')
@Unique(['postId', 'userId'])
@Index(['postId'])
@Index(['userId'])
export class PostLike {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;
    @Column()
    postId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;
}