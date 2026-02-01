import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowsService } from 'src/follows/follows.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private followsService: FollowsService
    ) {}

    
    // find all users
    async findAll() {
        return await this.userRepository.find();
    }

    // find user by id
    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }

    // find user by username
    async findByUsername(username: string) {
        return await this.userRepository.findOne({ where: { username } });
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }

    // create user
    async create(dto: CreateUserDto) {
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    // updating user
    async update(id: number, dto: UpdateUserDto) {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException();

        // pass as it is if something is not changed
        Object.assign(user, dto);
        return await this.userRepository.save(user);
    }
    
    // changing visibility from private to public or vice versa
    async changeVisibility(id: number) {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException();

        user.isPrivate = !user.isPrivate;
        await this.userRepository.save(user);

        return {message: `Profile is now: ${user.isPrivate ? 'Private' : 'Public'}`}

    }

    async remove(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException();

        await this.userRepository.remove(user);

        return {message: 'Account is removed!'}
    
    }

    async getProfile(viewerId: number, targetId: number) {
        await this.followsService.assertCanViewUser(viewerId, targetId);
        return this.findById(targetId);
    }
}
