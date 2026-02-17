import { ID, Price } from "../../../common";
import { PaymentStatus } from "../enum/payment-status";

export type PaymentConstructor = {
  id: string;
  status: string;
  amount: number;
  provider?: string;
  providerPaymentId?: string;
  currencyCode: string;
};

export abstract class Payment {
  protected id: ID;
  protected status: PaymentStatus;
  private amount: Price;
  private currencyCode: string;
  protected provider?: string;
  protected providerPaymentId?: string;

  protected constructor(props: PaymentConstructor) {
    this.id = new ID(props.id);
    this.status = props.status as PaymentStatus;
    this.amount = new Price(props.amount);
    this.currencyCode = props.currencyCode;
    this.provider = props.provider;
    this.providerPaymentId = props.providerPaymentId;
  }

  getId(): string {
    return this.id.getValue();
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getAmount(): number {
    return this.amount.getValue();
  }

  getCurrencyCode(): string {
    return this.currencyCode;
  }

  confirm(data: { provider: string; providerPaymentId: string }) {
    this.provider = data.provider;
    this.providerPaymentId = data.providerPaymentId;
    this.status = PaymentStatus.SUCCEEDED;
  }

  failed(data: { provider: string; providerPaymentId: string }): void {
    this.provider = data.provider;
    this.providerPaymentId = data.providerPaymentId;
    this.status = PaymentStatus.FAILED;
  }

  cancel(): void {
    this.status = PaymentStatus.CANCELED;
  }
}
