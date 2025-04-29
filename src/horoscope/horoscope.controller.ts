import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HoroscopeService } from './horoscope.service';
import {
  DailyHoroscopeQueryDto,
  DailyHoroscopeResponseDto,
} from './schemas/daily-horoscope.schema';

@ApiTags('Horoscope')
@Controller('horoscope')
export class HoroscopeController {
  constructor(private readonly horoscopeService: HoroscopeService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Получить ежедневный гороскоп' })
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: DailyHoroscopeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные параметры запроса',
  })
  @ApiResponse({
    status: 429,
    description: 'Превышен лимит запросов',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async getDailyHoroscope(
    @Query() query: DailyHoroscopeQueryDto,
  ): Promise<DailyHoroscopeResponseDto> {
    try {
      return await this.horoscopeService.getDailyHoroscope(
        query.sign,
        query.day,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Unexpected server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
