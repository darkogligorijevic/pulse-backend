import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum NotificationType {
    FOLLOW = 'FOLLOW',
    FOLLOW_REQUEST = 'FOLLOW_REQUEST',
    FOLLOW_ACCEPTED= 'FOLLOW_ACCEPTED',
    LIKE = 'LIKE',
    POST = 'POST',
    COMMENT = 'COMMENT'
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fromUserId: number;
    
    @Column()
    toUserId: number;

    @Column({type: 'enum', enum: NotificationType})
    type: NotificationType;

    @Column()
    message: string;

    @Column({ nullable: true })
    entityId?: number;
    
    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
