import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

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
            return this.signToken(user.id, user.email);

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
        if (!user) throw new ForbiddenException('Login credentials incorrect');

        const pwMatch = await argon.verify(user.hash, dto.password);

        // If password incorrect
        if (!pwMatch) throw new ForbiddenException('Login credentials incorrect');
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        })

        return { access_token: token }
    }
}