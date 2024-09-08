// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-pinterest';

// @Injectable()
// export class PinterestStrategy extends PassportStrategy(Strategy, 'pinterest') {
//   constructor() {
//     super({
//       clientID: process.env.PINTEREST_CLIENT_ID,
//       clientSecret: process.env.PINTEREST_CLIENT_SECRET,
//       callbackURL: 'http://localhost:3000/auth/pinterest/callback',
//       passReqToCallback: true,
//     });
//   }

//   async validate(accessToken: string, refreshToken: string, profile: any) {
//     console.log('Pinterest User Profile:', profile);
//     // You can return the user object or any relevant data
//     return profile;
//   }
// }
