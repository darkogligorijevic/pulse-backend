import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ example: 'Comment here!' })
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    comment: string; 
}