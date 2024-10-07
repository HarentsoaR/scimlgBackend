import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class UpdateRatingDto {
    @IsInt()
    @IsPositive() // Ensures the rating is a positive integer
    @IsNotEmpty() // Ensures the rating is not empty
    rating: number;
}
