// src/interfaces/request.interface.ts
import { Request } from 'express';
import { User } from '../model/user.entity';


export interface CustomRequest extends Request {
    user: User; // Define the user property with the User type
}
