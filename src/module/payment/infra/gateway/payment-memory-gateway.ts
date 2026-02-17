import { PaymentGateway } from "../../application";

export class PaymentMemoryGateway implements PaymentGateway {
  async createPaymentIntent(): Promise<{ token: string | null; id: string }> {
    return { token: "123", id: "123" };
  }
}
