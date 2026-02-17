import { UseCase } from "../../../common";
import { PaymentGateway } from "../../../payment";
import { MemoryOrder } from "../../domain/entity/memory-order";
import { ForbiddenError } from "../../error/forbidden-error";
import { MemoryWithoutPlanError } from "../../error/memory-without-plan-error";
import { UnitOfWorkMemory } from "../contract/unit-of-work-memory";

export class CreateMemoryOrderIntentUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly unitOfWorkMemory: UnitOfWorkMemory,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(input: Input): Promise<Output> {
    const memory = await this.unitOfWorkMemory.execute(({ memoryRepository }) =>
      memoryRepository.getById(input.memoryId),
    );
    if (memory.getUserId() !== input.userId) throw new ForbiddenError();
    const selectedPlanId = memory.getSelectedPlanId();
    if (!selectedPlanId) throw new MemoryWithoutPlanError();
    const plan = await this.unitOfWorkMemory.execute(({ planRepository }) =>
      planRepository.getById(selectedPlanId),
    );
    if (!plan) throw new MemoryWithoutPlanError();
    const memoryOrder = MemoryOrder.create({
      memoryPlan: plan,
      memoryId: memory.getId(),
      userId: input.userId,
      discount: plan.getDiscountValue(),
      price: plan.getPriceCents(),
      total: plan.getPriceCents() - plan.getDiscountValue(),
      currencyCode: plan.getCurrencyCode(),
    });
    const { token } = await this.paymentGateway.createPaymentIntent({
      amount: plan.calculateFinalPrice(),
      currency: plan.getCurrencyCode(),
      metadata: {
        memoryId: memory.getId(),
        memoryOrderId: memoryOrder.getId(),
        memoryPlanId: plan.getId(),
        userId: input.userId,
      },
    });
    memory.pendingPayment();
    await this.unitOfWorkMemory.execute(
      async ({ memoryOrderRepository, memoryRepository }) => {
        await memoryOrderRepository.create(memoryOrder);
        await memoryRepository.update(memory);
      },
    );
    return { token };
  }
}

export type Input = { memoryId: string; userId: string };

export type Output = {
  token: string | null;
};
