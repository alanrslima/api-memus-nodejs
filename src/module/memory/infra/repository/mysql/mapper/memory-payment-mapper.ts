import { MemoryPayment } from "../../../../domain/entity/memory-payment";

export type MemoryPaymentRow = {
  id: string;
  order_id: string;
  provider?: string;
  provider_payment_id?: string;
  currency_code: string;
  amount: number;
  status: string;
};

export class MemoryPaymentMapper {
  static toPersistence(input: MemoryPayment): MemoryPaymentRow {
    return {
      id: input.getId(),
      order_id: input.getOrderId(),
      provider: input.getProvider(),
      provider_payment_id: input.getProviderPaymentId(),
      currency_code: input.getCurrencyCode(),
      amount: input.getAmount(),
      status: input.getStatus(),
    };
  }

  static toEntity(input: MemoryPaymentRow): MemoryPayment {
    return MemoryPayment.build({
      id: input.id,
      amount: input.amount,
      currencyCode: input.currency_code,
      orderId: input.order_id,
      provider: input.provider,
      providerPaymentId: input.provider_payment_id,
      status: input.status,
    });
  }
}
