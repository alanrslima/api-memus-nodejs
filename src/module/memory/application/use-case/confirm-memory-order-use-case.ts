import { UseCase } from "../../../common";
import { MemoryPayment } from "../../domain/entity/memory-payment";

import { UnitOfWorkMemory } from "../contract/unit-of-work-memory";

export class ConfirmMemoryOrderUseCase implements UseCase<Input, Output> {
  constructor(private readonly unitOfWorkMemory: UnitOfWorkMemory) {}

  async execute(input: Input): Promise<Output> {
    await this.unitOfWorkMemory.execute(
      async ({ memoryOrderRepository, memoryRepository }) => {
        const memoryOrder = await memoryOrderRepository.getById(
          input.memoryOrderId,
        );
        const memory = await memoryRepository.getById(
          memoryOrder.getMemoryId(),
        );
        memoryOrder.confirmPayment();
        memory.confirmPayment(memoryOrder.getMemoryPlan());
        await memoryOrderRepository.update(memoryOrder);
        await memoryRepository.update(memory);
      },
    );
  }
}

export type Input = {
  memoryOrderId: string;
  provider: string;
  providerPaymentId: string;
};

export type Output = void;
