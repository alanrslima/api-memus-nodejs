import Stripe from "stripe";
import { PaymentGateway } from "../../application";
import { env } from "../../../common";
import { PaymentIntentDTO } from "../../application/contract/dto/payment-dto";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export class StripePaymentGateway implements PaymentGateway {
  async createPaymentIntent(
    params: PaymentIntentDTO,
  ): Promise<{ token: string | null; id: string }> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: params.metadata,
    });
    return { token: paymentIntent.client_secret, id: paymentIntent.id };
  }
}
