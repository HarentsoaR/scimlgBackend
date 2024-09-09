import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    // @IsString()
    // @IsNotEmpty()
    // abstract: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsEnum(['submitted', 'under_review', 'accepted', 'rejected'])
    status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
}
