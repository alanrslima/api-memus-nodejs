import { ID, Price } from "../../../common";
import { OrderStatus } from "../enum/order-status";
import { PaymentMethod } from "../enum/payment-method";
import { PaymentStatus } from "../enum/payment-status";

export type OrderConstructor = {
  id: string;
  status: OrderStatus;
  price: number;
  total: number;
  discount: number;
  currencyCode: string;
  // notes?: string;
  // orderStatus: OrderStatus;
  // paymentStatus?: PaymentStatus;
  // paymentMethod?: PaymentMethod;
  // discountAmount?: number;
  // totalAmount?: number;
  userId: string;
};

export abstract class Order {
  private id: ID;
  private status: OrderStatus;
  private userId: ID;
  private price: Price;
  private total: Price;
  private discount: Price;
  private currencyCode: string;
  private couponId?: string;

  constructor(props: OrderConstructor) {
    this.id = new ID(props.id);
    this.userId = new ID(props.userId);
    this.status = props.status;
    this.price = new Price(props.price);
    this.total = new Price(props.total);
    this.discount = new Price(props.discount);
    this.currencyCode = props.currencyCode;
    // this.notes = props.notes;
    // this.orderStatus = props.orderStatus;
  }

  confirmPayment() {
    this.status = OrderStatus.PAYMENT_SUCCEEDED;
  }

  failedPayment() {
    this.status = OrderStatus.PAYMENT_FAILED;
  }

  waitingPayment() {
    this.status = OrderStatus.WAITING_PAYMENT;
  }

  getId(): string {
    return this.id.getValue();
  }

  getUserId(): string {
    return this.userId.getValue();
  }

  getPrice(): number {
    return this.price.getValue();
  }

  getDiscount(): number {
    return this.discount.getValue();
  }

  getTotal(): number {
    return this.total.getValue();
  }

  getCurrencyCode(): string {
    return this.currencyCode;
  }

  getStatus(): string {
    return this.status;
  }
}
