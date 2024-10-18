// update-article.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateArticleDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;
}
