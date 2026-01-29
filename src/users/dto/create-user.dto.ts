import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: 'John'})
    @IsString()
    firstName: string;

    @ApiProperty({example: 'Doe'})
    @IsString()
    lastName: string;

    @ApiProperty({example: 'johndoe@example.com'})
    @IsEmail()
    email: string;

    @ApiProperty({example: 'john_doe'})
    @IsString()
    username: string;

    @ApiProperty()
    @MinLength(6)
    @IsString()
    password: string;
}