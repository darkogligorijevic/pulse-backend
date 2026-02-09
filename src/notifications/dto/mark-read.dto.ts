import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export class MarkReadDto {
    @IsArray()    
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    ids: number[];
}