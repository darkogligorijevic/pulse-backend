import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('post_comments')
export class PostComment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post
    @Column()
    postId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User
    @Column()
    userId: number;

    @Column({ nullable: false })
    comment: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}