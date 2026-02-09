import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "../entities/notification.entity";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {    
    @IsNumber()
    fromUserId: number;

    @IsNumber()
    toUserId: number;

    @IsOptional()
    @IsNumber()
    entityId?: number;

    @ApiProperty({ enum: NotificationType })
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiProperty({ example: 'Notification that goes to the user!' })
    @IsOptional()
    @IsString()
    message?: string;
};