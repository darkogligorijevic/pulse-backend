import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class LoginDto {
    
    @ApiProperty({example: 'john_doe'})
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;
}