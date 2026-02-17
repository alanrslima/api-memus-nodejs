import { ID } from "../../../common";
import { Order, OrderConstructor } from "../../../payment";
import { OrderStatus } from "../../../payment/domain/enum/order-status";
import { Plan } from "./plan";

type MemoryOrderCreate = {
  memoryId: string;
  memoryPlan: Plan;
  userId: string;
  total: number;
  discount: number;
  price: number;
  currencyCode: string;
};

type MemoryOrderBuild = OrderConstructor & MemoryOrderCreate;

export class MemoryOrder extends Order {
  private memoryId: ID;
  private memoryPlan: Plan;

  private constructor(props: MemoryOrderBuild) {
    super(props);
    this.memoryPlan = props.memoryPlan;
    this.memoryId = new ID(props.memoryId);
  }

  static create(props: MemoryOrderCreate): MemoryOrder {
    return new MemoryOrder({
      ...props,
      id: new ID().getValue(),
      status: OrderStatus.PENDING,
    });
  }

  static build(props: MemoryOrderBuild): MemoryOrder {
    return new MemoryOrder(props);
  }

  getMemoryId(): string {
    return this.memoryId.getValue();
  }

  getMemoryPlan(): Plan {
    return this.memoryPlan;
  }
}
