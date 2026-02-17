import { ID, Price } from "../../../common";
import { PaymentStatus } from "../enum/payment-status";

export type PaymentConstructor = {
  id: string;
  status: string;
  amount: number;
  currencyCode: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class Payment {
  protected id: ID;
  protected status: PaymentStatus;
  private amount: Price;
  private currencyCode: string;
  protected createdAt: Date;
  protected updatedAt: Date;

  protected constructor(props: PaymentConstructor) {
    this.id = new ID(props.id);
    this.status = props.status as PaymentStatus;
    this.amount = new Price(props.amount);
    this.currencyCode = props.currencyCode;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  getId(): string {
    return this.id.getValue();
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getAmount(): number {
    return this.amount.getValue();
  }

  getCurrencyCode(): string {
    return this.currencyCode;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  markAsPaid(): void {
    this.status = PaymentStatus.SUCCEEDED;
    this.touch();
  }

  markAsFailed(): void {
    this.status = PaymentStatus.FAILED;
    this.touch();
  }

  cancel(): void {
    this.status = PaymentStatus.CANCELED;
    this.touch();
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }
}
