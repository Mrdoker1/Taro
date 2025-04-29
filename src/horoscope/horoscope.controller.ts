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
import {
  WeeklyHoroscopeQueryDto,
  WeeklyHoroscopeResponseDto,
} from './schemas/weekly-horoscope.schema';
import {
  MonthlyHoroscopeQueryDto,
  MonthlyHoroscopeResponseDto,
} from './schemas/monthly-horoscope.schema';

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
        query.lang,
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

  @Get('weekly')
  @ApiOperation({ summary: 'Получить еженедельный гороскоп' })
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: WeeklyHoroscopeResponseDto,
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
  async getWeeklyHoroscope(
    @Query() query: WeeklyHoroscopeQueryDto,
  ): Promise<WeeklyHoroscopeResponseDto> {
    try {
      return await this.horoscopeService.getWeeklyHoroscope(
        query.sign,
        query.lang,
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

  @Get('monthly')
  @ApiOperation({ summary: 'Получить ежемесячный гороскоп' })
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: MonthlyHoroscopeResponseDto,
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
  async getMonthlyHoroscope(
    @Query() query: MonthlyHoroscopeQueryDto,
  ): Promise<MonthlyHoroscopeResponseDto> {
    try {
      return await this.horoscopeService.getMonthlyHoroscope(
        query.sign,
        query.lang,
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
