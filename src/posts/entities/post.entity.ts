
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { PostMedia } from './post-media.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  userId: number;

  @OneToMany(() => PostMedia, postMedia => postMedia.post, { cascade: true })
  media: PostMedia[];

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => PostLike, like => like.post, { cascade: true })
  likes: PostLike[]

  @OneToMany(() => PostComment, comment => comment.post, { cascade: true })
  comments: PostComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
