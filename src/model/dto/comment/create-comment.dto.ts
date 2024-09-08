import { Article } from "../../article.entity";
import { User } from "../../user.entity";

export class CreateCommentDto {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User; // Include user info if needed
    article: Article
}
