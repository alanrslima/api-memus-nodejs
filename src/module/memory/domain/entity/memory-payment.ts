import { ID } from "../../../common";
import {
  Payment,
  PaymentConstructor,
} from "../../../payment/domain/entity/payment";
import { PaymentStatus } from "../../../payment/domain/enum/payment-status";

type MemoryPaymentCreate = {
  orderId: string;
  amount: number;
  currencyCode: string;
};

type MemoryPaymentBuild = PaymentConstructor &
  MemoryPaymentCreate & {
    status: string;
  };

export class MemoryPayment extends Payment {
  private orderId: ID;

  private constructor(props: MemoryPaymentBuild) {
    super(props);
    this.orderId = new ID(props.orderId);
  }

  static create(props: MemoryPaymentCreate): MemoryPayment {
    return new MemoryPayment({
      ...props,
      id: new ID().getValue(),
      status: PaymentStatus.PENDING,
    });
  }

  static build(props: MemoryPaymentBuild): MemoryPayment {
    return new MemoryPayment(props);
  }

  getOrderId(): string {
    return this.orderId.getValue();
  }

  getProvider(): string | undefined {
    return this.provider;
  }

  getProviderPaymentId(): string | undefined {
    return this.providerPaymentId;
  }
}
