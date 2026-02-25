import { UseCase } from "../../../common";
import { PaymentGateway } from "../../../payment";
import { MemoryOrder } from "../../domain/entity/memory-order";
import { MemoryPayment } from "../../domain/entity/memory-payment";
import { ForbiddenError } from "../../error/forbidden-error";
import { MemoryWithoutPlanError } from "../../error/memory-without-plan-error";
import { UnitOfWorkMemory } from "../contract/unit-of-work-memory";

export class CreateMemoryOrderIntentUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly unitOfWorkMemory: UnitOfWorkMemory,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(input: Input): Promise<Output> {
    return await this.unitOfWorkMemory.execute(
      async ({
        memoryRepository,
        memoryOrderRepository,
        planRepository,
        memoryPaymentRepository,
      }) => {
        const memory = await memoryRepository.getById(input.memoryId);
        if (memory.getUserId() !== input.userId) throw new ForbiddenError();
        const selectedPlanId = memory.getSelectedPlanId();
        if (!selectedPlanId) throw new MemoryWithoutPlanError();
        const plan = await planRepository.getById(selectedPlanId);
        if (!plan) throw new MemoryWithoutPlanError();
        const total = plan.getPriceCents() - plan.getDiscountValue();

        const memoryOrder = MemoryOrder.create({
          memoryPlan: plan,
          memoryId: memory.getId(),
          userId: input.userId,
          discount: plan.getDiscountValue(),
          price: plan.getPriceCents(),
          total: total,
          currencyCode: plan.getCurrencyCode(),
        });

        // Caso o plano seja gratuido, o gateway de pagamento não é ativado e o album é confirmado como pronto para uso.
        if (memoryOrder.isFree()) {
          memoryOrder.confirmPayment();
          memory.confirmPayment(memoryOrder);
          await memoryRepository.update(memory);
          return { token: null };
        }

        const memoryPayment = MemoryPayment.create({
          amount: total,
          currencyCode: plan.getCurrencyCode(),
          orderId: memoryOrder.getId(),
        });
        memory.pendingPayment();
        await memoryRepository.update(memory);
        await memoryOrderRepository.create(memoryOrder);
        await memoryPaymentRepository.create(memoryPayment);
        const { token } = await this.paymentGateway.createPaymentIntent({
          amount: plan.calculateFinalPrice(),
          currency: plan.getCurrencyCode(),
          metadata: {
            memoryId: memory.getId(),
            memoryOrderId: memoryOrder.getId(),
            memoryPaymentId: memoryPayment.getId(),
            memoryPlanId: plan.getId(),
            userId: input.userId,
          },
        });
        return { token };
      },
    );
  }
}

export type Input = { memoryId: string; userId: string };

export type Output = {
  token: string | null;
};
