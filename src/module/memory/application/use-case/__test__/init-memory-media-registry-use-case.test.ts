import { Memory } from "../../../domain/entity/memory";
import { Plan } from "../../../domain/entity/plan";
import { MemoryNotReadyError } from "../../../error/memory-not-ready-error";
import { StorageMemoryGateway } from "../../../infra/gateway/memory/storage-memory-gateway";
import { MediaRegistryMemoryRepository } from "../../../infra/repository/memory/media-registry-memory-repository";
import { MemoryMemoryRepository } from "../../../infra/repository/memory/memory-memory-repository";
import { InitMemoryMediaRegistryUseCase } from "../init-memory-media-registry-use-case";

it("should update media counter at memory after create", async () => {
  const plan = Plan.create({
    currencyCode: "BRL",
    description: "desc",
    name: "name",
    priceCents: 10,
    photosLimit: 1,
    videosLimit: 2,
    position: 1,
  });
  const memory = Memory.create({
    startDate: new Date(),
    name: "name",
    userId: "123",
    isPrivate: false,
  });
  memory.confirmPayment(plan);
  const memoryRepository = new MemoryMemoryRepository([memory]);
  const mediaRegistryRepository = new MediaRegistryMemoryRepository();
  const storageGateway = new StorageMemoryGateway();
  const initMemoryMediaRegistryUseCase = new InitMemoryMediaRegistryUseCase(
    memoryRepository,
    mediaRegistryRepository,
    storageGateway,
  );
  expect(memoryRepository.data[0].getPhotosCount()).toEqual(0);
  await initMemoryMediaRegistryUseCase.execute({
    memoryId: memory.getId(),
    mimetype: "image/png",
    personaId: "123",
    size: 100,
    userId: "123",
  });
  expect(memoryRepository.data).toHaveLength(1);
  expect(memoryRepository.data[0].getPhotosCount()).toEqual(1);
});

it("should not create a registry if the memory plan is full", async () => {
  const plan = Plan.create({
    currencyCode: "BRL",
    description: "desc",
    name: "name",
    priceCents: 10,
    photosLimit: 1,
    videosLimit: 2,
    position: 1,
  });
  const memory = Memory.create({
    startDate: new Date(),
    name: "name",
    userId: "123",
    isPrivate: false,
  });
  memory.confirmPayment(plan);
  const memoryRepository = new MemoryMemoryRepository([memory]);
  const mediaRegistryRepository = new MediaRegistryMemoryRepository();
  const storageGateway = new StorageMemoryGateway();
  const initMemoryMediaRegistryUseCase = new InitMemoryMediaRegistryUseCase(
    memoryRepository,
    mediaRegistryRepository,
    storageGateway,
  );
  await initMemoryMediaRegistryUseCase.execute({
    memoryId: memory.getId(),
    mimetype: "image/png",
    personaId: "123",
    size: 100,
    userId: "123",
  });
  await initMemoryMediaRegistryUseCase.execute({
    memoryId: memory.getId(),
    mimetype: "video/mp4",
    personaId: "123",
    size: 100,
    userId: "123",
  });
  try {
    await initMemoryMediaRegistryUseCase.execute({
      memoryId: memory.getId(),
      mimetype: "image/png",
      personaId: "123",
      size: 100,
      userId: "123",
    });
  } catch (error) {
    expect(error).toBeDefined();
  }
});

it("should not init a media registry if the memory is not ready", async () => {
  const memory = Memory.create({
    startDate: new Date(),
    name: "name",
    userId: "123",
    isPrivate: false,
  });
  const memoryRepository = new MemoryMemoryRepository([memory]);
  const mediaRegistryRepository = new MediaRegistryMemoryRepository();
  const storageGateway = new StorageMemoryGateway();
  const initMemoryMediaRegistryUseCase = new InitMemoryMediaRegistryUseCase(
    memoryRepository,
    mediaRegistryRepository,
    storageGateway,
  );
  const execute = async () =>
    await initMemoryMediaRegistryUseCase.execute({
      memoryId: memory.getId(),
      mimetype: "image/png",
      personaId: "123",
      size: 100,
      userId: "123",
    });
  expect(execute).rejects.toThrow(MemoryNotReadyError);
});
