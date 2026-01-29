import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const existingUsername = await this.usersService.findByUsername(dto.username);
        const existingEmail = await this.usersService.findByEmail(dto.email);
        if (existingUsername || existingEmail) throw new BadRequestException('Username or email already exists!');

        const hashed = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            ...dto,
            password: hashed
        });

        return this.signToken(user);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByUsername(dto.username);
        if (!user) throw new NotFoundException("This user doesn't exist!");

        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) throw new UnauthorizedException("Password is incorrect!");

        return this.signToken(user);
    }

    private signToken(user: User) {
        const payload = { sub: user.id, username: user.username };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}
