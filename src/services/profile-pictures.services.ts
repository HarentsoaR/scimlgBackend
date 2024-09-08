// import { Injectable } from '@nestjs/common';
// import { createCanvas } from 'canvas';

// @Injectable()
// export class ProfilePictureService {
//   generateProfilePicture(username: string): Buffer {
//     const firstLetter = username.charAt(0).toUpperCase();
//     const canvas = createCanvas(200, 200); // Set the size of the image
//     const ctx = canvas.getContext('2d');

//     // Set background color
//     ctx.fillStyle = '#4CAF50'; // Change this to any color you want
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Set text style
//     ctx.fillStyle = '#FFFFFF'; // Text color
//     ctx.font = 'bold 100px Arial'; // Font size and style
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';

//     // Draw the letter
//     ctx.fillText(firstLetter, canvas.width / 2, canvas.height / 2);

//     // Return the image as a buffer
//     return canvas.toBuffer('image/png');
//   }
// }
