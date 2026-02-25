import { PaymentMemoryGateway } from "../../../../payment/infra/gateway/payment-memory-gateway";
import { Discount } from "../../../domain/entity/discount";
import { Memory } from "../../../domain/entity/memory";
import { Plan } from "../../../domain/entity/plan";
import { ForbiddenError } from "../../../error/forbidden-error";
import { MemoryWithoutPlanError } from "../../../error/memory-without-plan-error";
import { MemoryMemoryRepository } from "../../../infra/repository/memory/memory-memory-repository";
import { MemoryOrderMemoryRepository } from "../../../infra/repository/memory/memory-order-memory-repository";
import { MemoryPaymentMemoryRepository } from "../../../infra/repository/memory/memory-payment-memory-repository";
import { PlanMemoryRepository } from "../../../infra/repository/memory/plan-memory-repository";
import { UnitOfWorkMemoryMemory } from "../../../infra/unit-of-work/unit-of-work-memory-memory";
import { CreateMemoryOrderIntentUseCase } from "../create-memory-order-intent-use-case";

const makeplan = (overrides?: Partial<Parameters<typeof Plan.create>[0]>) =>
  Plan.create({
    currencyCode: "BRL",
    description: "Plan desc",
    name: "Plan name",
    photosLimit: 100,
    position: 1,
    priceCents: 1000,
    videosLimit: 30,
    ...overrides,
  });

const makeSut = (memory: Memory, plan: Plan | null) => {
  const memoryRepository = new MemoryMemoryRepository([memory]);
  const memoryOrderRepository = new MemoryOrderMemoryRepository();
  const memoryPaymentRepository = new MemoryPaymentMemoryRepository();
  const planRepository = new PlanMemoryRepository(plan ? [plan] : []);
  const unitOfWorkMemory = new UnitOfWorkMemoryMemory({
    planRepository,
    memoryRepository,
    memoryOrderRepository,
    memoryPaymentRepository,
  });
  const paymentGateway = new PaymentMemoryGateway();
  const useCase = new CreateMemoryOrderIntentUseCase(
    unitOfWorkMemory,
    paymentGateway,
  );
  return {
    useCase,
    memoryRepository,
    memoryOrderRepository,
    memoryPaymentRepository,
  };
};

describe("CreateMemoryOrderIntentUseCase", () => {
  it("should create a memory order intent for a paid plan", async () => {
    const memory = Memory.create({ userId: "123" });
    const plan = makeplan();
    memory.selectPlan(plan);
    const { useCase, memoryRepository, memoryOrderRepository } = makeSut(
      memory,
      plan,
    );

    expect(memoryRepository.data[0].getStatus()).toEqual("DRAFT");
    expect(memoryOrderRepository.data).toHaveLength(0);

    const response = await useCase.execute({
      memoryId: memory.getId(),
      userId: "123",
    });

    expect(memoryRepository.data[0].getStatus()).toEqual("PENDING_PAYMENT");
    expect(memoryOrderRepository.data).toHaveLength(1);
    expect(memoryOrderRepository.data[0].getStatus()).toEqual("PENDING");
    expect(response.token).toBeDefined();
    expect(response.token).not.toBeNull();
  });

  it("should create a memory payment record for a paid plan", async () => {
    const memory = Memory.create({ userId: "123" });
    const plan = makeplan();
    memory.selectPlan(plan);
    const { useCase, memoryPaymentRepository } = makeSut(memory, plan);

    await useCase.execute({ memoryId: memory.getId(), userId: "123" });

    expect(memoryPaymentRepository.data).toHaveLength(1);
    expect(memoryPaymentRepository.data[0].getOrderId()).toEqual(
      expect.any(String),
    );
  });

  it("should skip payment gateway and confirm memory when plan is free", async () => {
    const memory = Memory.create({ userId: "123" });
    const plan = makeplan({ priceCents: 0 });
    memory.selectPlan(plan);
    const {
      useCase,
      memoryRepository,
      memoryOrderRepository,
      memoryPaymentRepository,
    } = makeSut(memory, plan);

    const response = await useCase.execute({
      memoryId: memory.getId(),
      userId: "123",
    });

    expect(response.token).toBeNull();
    expect(memoryRepository.data[0].getStatus()).toEqual("ACTIVE");
    expect(memoryOrderRepository.data).toHaveLength(0);
    expect(memoryPaymentRepository.data).toHaveLength(0);
  });

  it("should throw ForbiddenError when userId does not match memory owner", async () => {
    const memory = Memory.create({ userId: "123" });
    const plan = makeplan();
    memory.selectPlan(plan);
    const { useCase } = makeSut(memory, plan);

    await expect(
      useCase.execute({ memoryId: memory.getId(), userId: "wrong-user" }),
    ).rejects.toThrow(ForbiddenError);
  });

  it("should throw MemoryWithoutPlanError when memory has no selected plan", async () => {
    const memory = Memory.create({ userId: "123" });
    const plan = makeplan();
    // memory.selectPlan não é chamado
    const { useCase } = makeSut(memory, plan);

    await expect(
      useCase.execute({ memoryId: memory.getId(), userId: "123" }),
    ).rejects.toThrow(MemoryWithoutPlanError);
  });

  it("should calculate order total applying plan discount", async () => {
    const memory = Memory.create({ userId: "123" });
    const plan = makeplan({
      priceCents: 1000,
      discount: Discount.create({ name: "discount", percentage: 20 }),
    });
    memory.selectPlan(plan);
    const { useCase, memoryOrderRepository } = makeSut(memory, plan);

    await useCase.execute({ memoryId: memory.getId(), userId: "123" });

    expect(memoryOrderRepository.data[0].getTotal()).toEqual(800);
  });
});
