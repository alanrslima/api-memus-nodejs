import { PaymentMemoryGateway } from "../../../../payment/infra/gateway/payment-memory-gateway";
import { Memory } from "../../../domain/entity/memory";
import { Plan } from "../../../domain/entity/plan";
import { MemoryMemoryRepository } from "../../../infra/repository/memory/memory-memory-repository";
import { MemoryOrderMemoryRepository } from "../../../infra/repository/memory/memory-order-memory-repository";
import { PlanMemoryRepository } from "../../../infra/repository/memory/plan-memory-repository";
import { UnitOfWorkMemoryMemory } from "../../../infra/unit-of-work/unit-of-work-memory-memory";
import { CreateMemoryOrderIntentUseCase } from "../create-memory-order-intent-use-case";

it("should create a memory order intent", async () => {
  const memory = Memory.create({ userId: "123" });
  const plan = Plan.create({
    currencyCode: "BRL",
    description: "Plan desc",
    name: "Plan name",
    photosLimit: 100,
    position: 1,
    priceCents: 1000,
    videosLimit: 30,
  });
  memory.selectPlan(plan);
  const memoryRepository = new MemoryMemoryRepository([memory]);
  const memoryOrderRepository = new MemoryOrderMemoryRepository();
  const planRepository = new PlanMemoryRepository([plan]);
  const unitOfWorkMemory = new UnitOfWorkMemoryMemory({
    planRepository,
    memoryRepository,
    memoryOrderRepository,
  });

  const paymentGateway = new PaymentMemoryGateway();
  const createMemoryOrderIntentUseCase = new CreateMemoryOrderIntentUseCase(
    unitOfWorkMemory,
    paymentGateway,
  );
  expect(memoryRepository.data[0].getStatus()).toEqual("DRAFT");
  expect(memoryOrderRepository.data).toHaveLength(0);
  const response = await createMemoryOrderIntentUseCase.execute({
    memoryId: memory.getId(),
    userId: "123",
  });
  expect(memoryRepository.data[0].getStatus()).toEqual("PENDING_PAYMENT");
  expect(memoryOrderRepository.data).toHaveLength(1);
  expect(memoryOrderRepository.data[0].getStatus()).toEqual("PENDING");
  expect(response.token).toBeDefined();
});
