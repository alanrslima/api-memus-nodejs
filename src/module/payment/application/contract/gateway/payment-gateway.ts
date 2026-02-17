import { PaymentIntentDTO } from "../dto/payment-dto";

export interface PaymentGateway {
  createPaymentIntent(
    params: PaymentIntentDTO,
  ): Promise<{ token: string | null; id: string }>;
}
