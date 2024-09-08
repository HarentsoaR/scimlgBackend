import { Controller, Get, Req, Res, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Initiates the Google OAuth2 login process
  }

  @Get('google/callback')
@UseGuards(AuthGuard('google'))
googleLoginCallback(@Req() req: Request, @Res() res: Response) {
  const user = req.user; // User info from Google
  console.log('Google OAuth Success:', user);

  // Construct the redirect URL
  // const redirectUrl = `http://localhost:8080/welcome?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&url=${encodeURIComponent(user.photo)}`;

  // // Redirect to the Next.js app with user info
  // res.redirect(redirectUrl);
}


  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    // Initiates the Facebook OAuth2 login process
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user; // User info from Facebook
    // const redirectUrl = `http://localhost:8080/welcome?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&url=${encodeURIComponent(user.photo)}`;

    // console.log('Facebook OAuth Success:', user);
    // res.redirect(redirectUrl);
  }
}
