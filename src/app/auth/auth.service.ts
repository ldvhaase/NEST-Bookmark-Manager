import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signUp(dto: AuthDto) {
        // generate password
        const hash = await argon.hash(dto.password);

        // save new user in db
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
        })
        console.log('Creating new user');

        delete user.hash;

        return user;

    }

    signIn(dto: AuthDto) {
        console.log({
            dto
        })
        return dto;
    }
}
