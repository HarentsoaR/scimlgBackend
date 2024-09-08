import { IsString, IsInt, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateEvaluationDto {
    @IsNotEmpty()
    articleId: number;

    @IsString()
    @IsNotEmpty()
    comments: string;

    @IsInt()
    rating: number;

    @IsEnum(['pending', 'completed'])
    status: 'pending' | 'completed';
}
