import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @IsString()
  @Length(1, 50)
  @ApiProperty({ description: '채팅방 이름' })
  chat: string;

  @IsString()
  @ApiProperty({ description: '송신자' })
  sender: string;

  @IsString()
  @ApiProperty({ description: '메시지' })
  message: string;
}
