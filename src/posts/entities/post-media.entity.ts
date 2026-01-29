import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video'
}

@Entity('post_medias')
export class PostMedia {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, post => post.media, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;
    @Column()
    postId: number;

    @Column({ type: 'enum', enum: MediaType })
    type: MediaType;

    @Column({ length: 2048 })
    url: string;

    @Column({ type: 'int', default: 0 })
    order: number; // for carousel

    @Column({ length: 2048, nullable: true })
    thumbnailUrl: string; // for thumnbail video

    @CreateDateColumn()
    createdAt: Date;
}