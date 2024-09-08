// src/model/dto/users/update-user.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    institution?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    // Add any other fields you want to update
}
