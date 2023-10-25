import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService) { }

    async signUp(dto: AuthDto) {
        // generate password
        const hash = await argon.hash(dto.password);

        // save new user in db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            })

            console.log('Creating new user');
            delete user.hash;

            return user;
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') throw new ForbiddenException('Duplicate email provided');
                throw err;
            }
        }
    }

    async signIn(dto: AuthDto) {
        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        // If user doesn't exist
        if(!user) throw new ForbiddenException('Login credentials incorrect');

        const pwMatch = await argon.verify( user.hash, dto.password);

        // If password incorrect
        if(!pwMatch) throw new ForbiddenException('Login credentials incorrect');

        delete user.hash;
        return user;
    }
}
