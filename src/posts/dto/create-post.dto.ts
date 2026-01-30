import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class CreatePostDto {
    @ApiProperty({ example: 'Write description here' })
    @IsOptional()
    @IsString()
    description: string;
}