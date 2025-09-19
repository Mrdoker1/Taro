import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  description: string;

  @IsString()
  returnUrl: string;

  @IsOptional()
  @IsString()
  callbackUrl?: string;
}
