import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('follow_requests')
@Unique(['fromUserId', 'toUserId'])
@Index(['fromUserId'])
@Index(['toUserId'])
export class FollowRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fromUserId: number;

    @Column()
    toUserId: number;

    @CreateDateColumn()
    createdAt: Date;
}