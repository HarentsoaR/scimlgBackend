// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-twitter';

// @Injectable()
// export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
//   constructor() {
//     super({
//       consumerKey: process.env.TWITTER_CONSUMER_KEY,
//       consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//       callbackURL: 'http://localhost:3000/auth/twitter/callback',
//       includeEmail: true,
//     });
//   }

//   async validate(token: string, tokenSecret: string, profile: any, done: any) {
//     try {
//       const { id, displayName, emails } = profile;
//       const user = {
//         twitterId: id,
//         username: displayName,
//         email: emails[0]?.value, // Optional chaining
//         token,
//         tokenSecret,
//       };
//       done(null, user);
//     } catch (error) {
//       console.error('Error during validation:', error);
//       done(error, false);
//     }
//   }
// }
