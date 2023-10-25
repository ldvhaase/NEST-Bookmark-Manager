import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtStrategy } from '../auth/strategy';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getMe(@Req() req: Request) {
        return req.user
    }
}
