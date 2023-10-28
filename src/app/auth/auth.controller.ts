import { Body, Controller, HttpCode, HttpStatus, Logger, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signUp(@Body() dto: AuthDto) {
        return this.authService.signUp(dto);
    };

    @HttpCode(HttpStatus.ACCEPTED)
    @Post('signin')
    signIn(@Body() dto: AuthDto) {
        return this.authService.signIn(dto);
    };
}
