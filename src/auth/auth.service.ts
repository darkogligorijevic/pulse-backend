import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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

        const existing = await this.usersService.findByUsername(dto.username);
        if (existing) throw new BadRequestException('Username already exists!');

        const hashed = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            ...dto,
            password: hashed
        });

        return this.signToken(user);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByUsername(dto.username);
        if (!user) throw new UnauthorizedException();

        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) throw new UnauthorizedException();

        return this.signToken(user);
    }

    private signToken(user: User) {
        const payload = { sub: user.id, username: user.username };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}
