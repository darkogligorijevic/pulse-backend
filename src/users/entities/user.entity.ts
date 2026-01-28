
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Follow } from 'src/follows/entities/follow.entity';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'enum', enum: Gender })
  gender: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({default: true})
  isPrivate: boolean;

  @Column({ default: false })
  isVerified: boolean;
  
  @OneToMany(() => Follow, follow => follow.following)
  followings: Follow[];

  @OneToMany(() => Follow, follow => follow.follower)
  followers: Follow[];

  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
