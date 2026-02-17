import { Memory } from "../../../domain/entity/memory";
import { ForbiddenError } from "../../../error/forbidden-error";
import { StorageMemoryGateway } from "../../../infra/gateway/memory/storage-memory-gateway";
import { MemoryMemoryRepository } from "../../../infra/repository/memory/memory-memory-repository";
import { MemoryOrderMemoryRepository } from "../../../infra/repository/memory/memory-order-memory-repository";
import { UnitOfWorkMemoryMemory } from "../../../infra/unit-of-work/unit-of-work-memory-memory";
import { UpdateMemoryUseCase } from "../update-memory-use-case";

it("should not update a memory if the user is not the owner", async () => {
  const memory = Memory.create({ userId: "1" });
  const storageGateway = new StorageMemoryGateway();
  const unitOfWorkMemory = new UnitOfWorkMemoryMemory({
    memoryOrderRepository: new MemoryOrderMemoryRepository(),
    memoryRepository: new MemoryMemoryRepository([memory]),
  });
  const updateMemoryUseCase = new UpdateMemoryUseCase(
    unitOfWorkMemory,
    storageGateway,
  );
  expect(async () => {
    await updateMemoryUseCase.execute({
      id: memory.getId(),
      userId: "2",
      address: {
        country: "Brasil",
        countryCode: "BR",
        state: "SP",
        city: "São Paulo",
        neighborhood: "Vila Mariana",
        longitude: -46.6345,
        latitude: -23.5882,
        addressLine1: "Rua Vergueiro, 1234",
        addressLine2: "Apto 502, Bloco B",
        postcode: "04101-000",
      },
    });
  }).rejects.toThrow(ForbiddenError);
});

it("should update a memory", async () => {
  const memory = Memory.create({ userId: "123" });
  const storageGateway = new StorageMemoryGateway();
  const memoryRepository = new MemoryMemoryRepository([memory]);
  const unitOfWorkMemory = new UnitOfWorkMemoryMemory({
    memoryOrderRepository: new MemoryOrderMemoryRepository(),
    memoryRepository,
  });
  const updateMemoryUseCase = new UpdateMemoryUseCase(
    unitOfWorkMemory,
    storageGateway,
  );

  const address = {
    country: "Brasil",
    countryCode: "BR",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Vila Mariana",
    longitude: -46.6345,
    latitude: -23.5882,
    addressLine1: "Rua Vergueiro, 1234",
    addressLine2: "Apto 502, Bloco B",
    postcode: "04101-000",
  };
  await updateMemoryUseCase.execute({
    id: memory.getId(),
    userId: memory.getUserId(),
    address,
    name: "name",
    startDate: new Date().toISOString(),
    file: {
      buffer: Buffer.from(""),
      encoding: "enc",
      fieldname: "fieldname",
      mimetype: "image/png",
      originalname: "originalmane.jpg",
      size: 10000,
    },
  });
  expect(memoryRepository.data).toHaveLength(1);
  expect(memoryRepository.data[0].getName()).toEqual("name");
  expect(memoryRepository.data[0].getStartDate()).toBeDefined();
  expect(storageGateway.data).toHaveLength(1);
});
