import { IsString, IsInt, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateEvaluationDto {
    @IsNotEmpty()
    articleId: number;

    @IsNotEmpty()
    evaluatorId: number;

    @IsInt()
    rating: number;
}
