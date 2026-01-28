import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';

@Entity('follows')
@Unique(['followerId', 'followingId'])
@Index(['followerId'])
@Index(['followingId'])
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.followings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followingId' })
    following: User;
    @Column()
    followingId: number;

    @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followerId' })
    follower: User;
    @Column()
    followerId: number;

    @CreateDateColumn()
    createdAt: Date;
}