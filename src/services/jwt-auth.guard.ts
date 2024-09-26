import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing.');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token is missing.');
        }

        try {
            // console.log('Token received:', token); // Log the token
            const payload = await this.jwtService.verifyAsync(token);
            // console.log('Token payload:', payload); // Log the payload
            request.user = payload; // Attach user info to request
            return true;
        } catch (error) {
            console.error('Token verification error:', error); // Log the error
            throw new UnauthorizedException('Invalid token.');
        }
    }

    getRequest(context: ExecutionContext) {
        const ctx = context.switchToHttp();
        return ctx.getRequest();
    }

    async validate(payload: any) {
        return { id: payload.id, email: payload.email, role: payload.role, name: payload.username }; // Ensure this matches your payload structure
    }
}
