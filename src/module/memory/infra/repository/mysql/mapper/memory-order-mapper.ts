import { OrderStatus } from "../../../../../payment/domain/enum/order-status";
import { MemoryOrder } from "../../../../domain/entity/memory-order";
import { Plan } from "../../../../domain/entity/plan";

export type MemoryOrderRow = {
  id: string;
  memory_id: string;
  user_id: string;
  plan_snapshot: unknown;
  status: string | null;
  currency_code: string;
  price: number;
  discount: number;
  total: number;
};

export class MemoryOrderMapper {
  static toPersistence(input: MemoryOrder): MemoryOrderRow {
    return {
      id: input.getId(),
      memory_id: input.getMemoryId(),
      user_id: input.getUserId(),
      plan_snapshot: input.getMemoryPlan(), // será salvo como JSON
      status: input.getStatus(),
      currency_code: input.getCurrencyCode(),
      price: input.getPrice(),
      discount: input.getDiscount(),
      total: input.getTotal(),
    };
  }

  static toEntity(input: MemoryOrderRow): MemoryOrder {
    return MemoryOrder.build({
      id: input.id,
      memoryId: input.memory_id,
      memoryPlan: Plan.build(input.plan_snapshot as any),
      userId: input.user_id,
      status: input.status as OrderStatus,
      currencyCode: input.currency_code,
      price: input.price,
      discount: input.discount,
      total: input.total,
    });
  }
}
