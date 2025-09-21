import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'Дата истечения подписки в формате ISO string',
    example: '2025-09-21T10:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly subscriptionExpiresAt?: string;
}
