import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
      @ApiProperty({ example: 'John' })
      @IsOptional()
      @IsString()
      firstName: string;
      @ApiProperty({ example: 'Doe' })
      @IsOptional()
      @IsString()
      lastName: string;
      @ApiProperty({ example: 'john_doe@example.com' })
      @IsOptional()
      @IsString()
      email: string;
      @ApiProperty({ example: 'john_doe' })
      @IsOptional()
      @IsString()
      username: string;
      @ApiProperty({ example: 'Bio comes here...' })
      @IsOptional()
      @IsString()
      bio: string;
      @ApiProperty({ example: 'Avatar comes here...' })
      @IsOptional()
      @IsString()
      avatarUrl: string;
}