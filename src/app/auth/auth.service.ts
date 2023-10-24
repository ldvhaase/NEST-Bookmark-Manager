import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService){}
    signIn() {
        
        return { msg: 'I am signing up' };
    }

    signUp() {
        return 'I am signing in';
    }
}
