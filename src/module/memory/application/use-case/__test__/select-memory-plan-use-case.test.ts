import { Memory } from "../../../domain/entity/memory";
import { MemoryOrder } from "../../../domain/entity/memory-order";
import { Plan } from "../../../domain/entity/plan";
import { MemoryPlanChangeError } from "../../../error/memory-plan-change-error";
import { MemoryMemoryRepository } from "../../../infra/repository/memory/memory-memory-repository";
import { PlanMemoryRepository } from "../../../infra/repository/memory/plan-memory-repository";
import { SelectMemoryPlanUseCase } from "../select-memory-plan-use-case";

it("should select memory plan", async () => {
  const plan = Plan.create({
    currencyCode: "BRL",
    description: "desc",
    name: "name",
    photosLimit: 100,
    position: 1,
    priceCents: 4999,
    videosLimit: 50,
  });
  const memory = Memory.create({ userId: "1" });
  const memoryRepository = new MemoryMemoryRepository([memory]);
  const planRepository = new PlanMemoryRepository([plan]);
  const selectMemoryPlanUseCase = new SelectMemoryPlanUseCase(
    memoryRepository,
    planRepository,
  );
  await selectMemoryPlanUseCase.execute({
    memoryId: memory.getId(),
    planId: plan.getId(),
    userId: memory.getUserId(),
  });
  expect(memoryRepository.data[0].getSelectedPlanId()).toBeDefined();
  expect(memoryRepository.data[0].getSelectedPlanId()).toEqual(plan.getId());
});

it("should not select a memory plan if its not in draft status", async () => {
  const plan = Plan.create({
    currencyCode: "BRL",
    description: "desc",
    name: "name",
    photosLimit: 100,
    position: 1,
    priceCents: 4999,
    videosLimit: 50,
  });
  const memory = Memory.create({ userId: "1" });
  const order = MemoryOrder.create({
    currencyCode: plan.getCurrencyCode(),
    discount: 0,
    memoryId: memory.getId(),
    memoryPlan: plan,
    price: plan.getPriceCents(),
    total: plan.getPriceCents(),
    userId: memory.getUserId(),
  });
  memory.confirmPayment(order);
  const memoryRepository = new MemoryMemoryRepository([memory]);
  const planRepository = new PlanMemoryRepository([plan]);
  const selectMemoryPlanUseCase = new SelectMemoryPlanUseCase(
    memoryRepository,
    planRepository,
  );
  const execute = async () =>
    await selectMemoryPlanUseCase.execute({
      memoryId: memory.getId(),
      planId: plan.getId(),
      userId: memory.getUserId(),
    });
  expect(execute).rejects.toThrow(MemoryPlanChangeError);
});
