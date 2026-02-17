import Stripe from "stripe";
import { env } from "../../../common";
import { NextFunction, Request, Response } from "express";
import { MemoryMysqlRepository } from "../../infra/repository/mysql/memory-mysql-repository";
import { confirmMemoryOrderUserCaseFactory } from "../../main/factory/use-case/confirm-memory-order-use-case-factory";
import { waitingMemoryOrderUserCaseFactory } from "../../main/factory/use-case/waiting-memory-order-use-case-factory";
// import { CreateMemoryMediaRegistryUseCase } from "../../application/use-case/create-memory-media-registry-use-case";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export class StripeWebhookMemoryController {
  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const sig = request.headers["stripe-signature"];
    const endpointSecret = env.STRIPE_ENDPOINT_SECRET;
    if (!sig) {
      response.status(400).json({ message: "Stripe Signature not provided" });
      return;
    }
    let event: Stripe.Event | undefined = undefined;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err}`);
      next(err);
    }

    // Handle the event
    switch (event?.type) {
      case "payment_intent.succeeded":
        const { memoryOrderId } = event?.data.object.metadata;
        confirmMemoryOrderUserCaseFactory()
          .execute({
            memoryOrderId,
            provider: "stripe",
            providerPaymentId: event.id,
          })
          .then(console.info)
          .catch(console.error);
        break;
      case "payment_intent.created":
        console.log("payment intent created", event);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log("PaymentMethod was attached to a Customer!");
        break;
      case "charge.failed":
        console.log("Cobrança falhou");
      case "payment_intent.payment_failed":
        console.log("Pagamento falhou");
      // ... handle other event types
      case "payment_intent.requires_action":
        const metadata = event?.data?.object.metadata;
        waitingMemoryOrderUserCaseFactory()
          .execute({ memoryOrderId: metadata?.memoryOrderId })
          .then(console.info)
          .catch(console.error);
      // Update memory order status
      default:
        console.log(`Unhandled event type ${event?.type}`);
    }
    response.status(200).json({ message: "Payment processed succesfully" });
  }
}
