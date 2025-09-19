import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

export interface PaymentOrderResult {
  success: boolean;
  mdOrder?: string;
  orderId?: string;
  formUrl?: string;
  error?: string;
}

export interface PaymentStatusResult {
  success: boolean;
  status?: string;
  amount?: number;
  currency?: string;
  orderDescription?: string;
  paid?: boolean;
  error?: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  // Конфигурация для тестовой среды AlfaBank
  private readonly baseUrl =
    process.env.ALFABANK_API_URL || 'https://abby.rbsuat.com/payment/rest';
  private readonly username = process.env.ALFABANK_MERCHANT_LOGIN || 'demo';
  private readonly password = process.env.ALFABANK_MERCHANT_PASSWORD || 'demo';

  constructor() {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(`AlfaBank API URL: ${this.baseUrl}`);
      this.logger.log(`AlfaBank Login: ${this.username}`);
      this.logger.log(
        `AlfaBank Password: ${this.password ? '***CONFIGURED***' : 'NOT SET'}`,
      );
    }
  }

  /**
   * Создает заказ в платежном шлюзе
   */
  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<PaymentOrderResult> {
    try {
      this.logger.log(
        `Creating order for amount: ${createOrderDto.amount} ${createOrderDto.currency}`,
      );

      const currencyCode = this.getCurrencyCode(createOrderDto.currency);
      const orderNumber = this.generateOrderNumber();

      // Формируем body вручную для правильного экранирования специальных символов
      const bodyParams = [
        `userName=${encodeURIComponent(this.username)}`,
        `password=${encodeURIComponent(this.password)}`,
        `orderNumber=${encodeURIComponent(orderNumber)}`,
        `amount=${encodeURIComponent(createOrderDto.amount.toString())}`,
        `currency=${encodeURIComponent(currencyCode)}`,
        `returnUrl=${encodeURIComponent(createOrderDto.returnUrl)}`,
        `description=${encodeURIComponent(createOrderDto.description)}`,
      ];

      // Добавляем callbackUrl если указан
      if (createOrderDto.callbackUrl) {
        bodyParams.push(
          `callbackUrl=${encodeURIComponent(createOrderDto.callbackUrl)}`,
        );
      }

      const body = bodyParams.join('&');

      this.logger.log(`Creating order with params:`, {
        orderNumber,
        amount: createOrderDto.amount,
        currency: createOrderDto.currency,
        currencyCode,
        description: createOrderDto.description,
        returnUrl: createOrderDto.returnUrl,
      });

      const response = await fetch(`${this.baseUrl}/register.do`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errorCode) {
        this.logger.error(
          `Order creation failed: ${result.errorMessage}`,
          result,
        );
        return {
          success: false,
          error: result.errorMessage || 'Unknown error',
        };
      }

      this.logger.log(
        `Order created successfully: ${result.orderId || result.mdOrder}`,
      );

      return {
        success: true,
        mdOrder: result.orderId || result.mdOrder,
        orderId: result.orderId || result.mdOrder,
        formUrl: result.formUrl,
      };
    } catch (error) {
      this.logger.error('Error creating order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Проверяет статус платежа по orderId
   */
  async checkPaymentStatus(orderId: string): Promise<PaymentStatusResult> {
    try {
      this.logger.log(`Checking payment status for orderId: ${orderId}`);

      const bodyParams = [
        `userName=${encodeURIComponent(this.username)}`,
        `password=${encodeURIComponent(this.password)}`,
        `orderId=${encodeURIComponent(orderId)}`,
      ];

      const body = bodyParams.join('&');

      const response = await fetch(
        `${this.baseUrl}/getOrderStatusExtended.do`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errorCode) {
        this.logger.error(
          `Payment status check failed: ${result.errorMessage}`,
          result,
        );
        return {
          success: false,
          error: result.errorMessage || 'Unknown error',
        };
      }

      this.logger.log(
        `Payment status retrieved successfully for orderId: ${orderId}`,
        result,
      );

      // Статус 2 = оплачен, статус 1 = ожидает оплаты
      const isPaid = result.orderStatus === 2;

      return {
        success: true,
        status: result.orderStatus?.toString() || 'unknown',
        amount: result.amount ? parseInt(result.amount) : undefined,
        currency: result.currency || undefined,
        orderDescription: result.orderDescription || undefined,
        paid: isPaid,
      };
    } catch (error) {
      this.logger.error('Error checking payment status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Генерирует уникальный номер заказа
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER_${timestamp}_${random}`;
  }

  /**
   * Возвращает числовой код валюты
   */
  private getCurrencyCode(currency: string): string {
    const codes: Record<string, string> = {
      RUB: '643',
      USD: '840',
      EUR: '978',
    };

    const code = codes[currency.toUpperCase()];
    if (!code) {
      throw new BadRequestException(`Unsupported currency: ${currency}`);
    }

    return code;
  }
}
