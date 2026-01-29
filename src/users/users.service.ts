import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(data: Partial<User>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async findByUsername(username: string) {
        return this.userRepository.findOne({ where: { username } });
    }

    async findById(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    async findAll() {
        return this.userRepository.find();
    }
}
