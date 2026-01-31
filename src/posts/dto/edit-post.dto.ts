import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EditPostDto {
    @ApiProperty({ example: 'Write description...' })
    @IsString()
    @IsOptional()
    description: string;
}