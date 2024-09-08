import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty() // Ensuring email is not empty
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(['researcher', 'evaluator', 'admin'])
    role: 'researcher' | 'evaluator' | 'admin';

    // Optional fields for profile information
    @IsOptional() // Marking these fields as optional
    @IsString()
    title?: string;

    @IsOptional() // Marking these fields as optional
    @IsString()
    institution?: string;

    @IsOptional() // Marking these fields as optional
    @IsString()
    bio?: string;

    @IsOptional() // Marking these fields as optional
    @IsString()
    profilePicture?: string;
}
