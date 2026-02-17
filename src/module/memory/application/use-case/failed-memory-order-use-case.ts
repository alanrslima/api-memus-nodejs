import { UseCase } from "../../../common";
import { MemoryPaymentNotFoundError } from "../../error/memory-payment-not-found-error";
import { UnitOfWorkMemory } from "../contract/unit-of-work-memory";

export class FailedMemoryOrderUseCase implements UseCase<Input, Output> {
  constructor(private readonly unitOfWorkMemory: UnitOfWorkMemory) {}

  async execute(input: Input): Promise<Output> {
    await this.unitOfWorkMemory.execute(
      async ({
        memoryOrderRepository,
        memoryRepository,
        memoryPaymentRepository,
      }) => {
        const memoryOrder = await memoryOrderRepository.getById(
          input.memoryOrderId,
        );
        const memory = await memoryRepository.getById(
          memoryOrder.getMemoryId(),
        );

        const memoryPayment = await memoryPaymentRepository.getById(
          input.memoryPaymentId,
        );
        if (!memoryPayment) throw new MemoryPaymentNotFoundError();
        memoryPayment.failed({
          provider: input.provider,
          providerPaymentId: input.providerPaymentId,
        });
        memoryOrder.failedPayment();
        memory.failedPayment();
        await memoryPaymentRepository.update(memoryPayment);
        await memoryOrderRepository.update(memoryOrder);
        await memoryRepository.update(memory);
      },
    );
  }
}

export type Input = {
  memoryPaymentId: string;
  memoryOrderId: string;
  provider: string;
  providerPaymentId: string;
};

export type Output = void;
