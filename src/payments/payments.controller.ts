import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Logger,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Public } from './decorators/public.decorator';
import { BypassAuthGuard } from './guards/bypass-auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(BypassAuthGuard)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('create-order')
  @ApiOperation({ summary: 'Создать заказ для оплаты' })
  @ApiResponse({
    status: 200,
    description: 'Заказ успешно создан',
    schema: {
      example: {
        success: true,
        mdOrder: 'ORDER_1234567890_123',
        orderId: 'ORDER_1234567890_123',
        formUrl:
          'https://abby.rbsuat.com/payment/merchants/demo/payment_ru.html?mdOrder=...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка при создании заказа',
    schema: {
      example: {
        success: false,
        error: 'Invalid currency',
      },
    },
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      this.logger.log('Creating payment order', createOrderDto);

      const result = await this.paymentsService.createOrder(createOrderDto);

      if (!result.success) {
        throw new HttpException(
          {
            success: false,
            error: result.error,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        mdOrder: result.mdOrder,
        orderId: result.orderId,
        formUrl: result.formUrl,
      };
    } catch (error) {
      this.logger.error('Error creating order:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error:
            error instanceof Error ? error.message : 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get('check-status/:orderId')
  @ApiOperation({ summary: 'Проверить статус платежа' })
  @ApiParam({
    name: 'orderId',
    description: 'Идентификатор заказа',
    example: 'ORDER_1234567890_123',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус платежа получен успешно',
    schema: {
      example: {
        success: true,
        status: '2',
        amount: 7199,
        currency: 'USD',
        orderDescription: 'Подписка Doc Scanner - Годовая',
        paid: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка при проверке статуса',
    schema: {
      example: {
        success: false,
        error: 'Order not found',
      },
    },
  })
  async checkPaymentStatus(@Param('orderId') orderId: string) {
    try {
      this.logger.log('Checking payment status for orderId:', orderId);

      const result = await this.paymentsService.checkPaymentStatus(orderId);

      this.logger.log('Payment status service result:', {
        success: result.success,
        status: result.status,
        paid: result.paid,
        error: result.error,
      });

      if (!result.success) {
        this.logger.warn('Payment status check failed:', result.error);
        throw new HttpException(
          {
            success: false,
            error: result.error,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        status: result.status,
        amount: result.amount,
        currency: result.currency,
        orderDescription: result.orderDescription,
        paid: result.paid,
      };
    } catch (error) {
      this.logger.error('Error checking payment status:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error:
            error instanceof Error ? error.message : 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post('webhook')
  @ApiOperation({
    summary: 'Webhook для уведомлений от Альфа-Банка о статусе платежа',
  })
  @ApiResponse({
    status: 200,
    description: 'Уведомление успешно обработано',
    schema: { example: { success: true } },
  })
  handlePaymentWebhook(@Body() body: any): { success: boolean } {
    this.logger.log(
      '💳 Received payment webhook:',
      JSON.stringify(body, null, 2),
    );

    try {
      const { orderId, mdOrder, status } = body;

      if (!orderId && !mdOrder) {
        this.logger.warn('⚠️ Webhook received without orderId or mdOrder');
        return { success: false };
      }

      // Используем orderId или mdOrder
      const paymentOrderId = orderId || mdOrder;

      this.logger.log(
        `🔄 Processing webhook for order: ${paymentOrderId}, status: ${status}`,
      );

      // Здесь можно добавить дополнительную логику:
      // 1. Сохранить событие в базу данных
      // 2. Отправить уведомление через WebSocket/SSE
      // 3. Обновить статус заказа
      // 4. Уведомить клиента через push-уведомления

      return { success: true };
    } catch (error) {
      this.logger.error('❌ Error processing payment webhook:', error);
      return { success: false };
    }
  }
}
