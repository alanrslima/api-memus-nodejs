import { MediaRegistry } from "../../../domain/entity/media-registry";
import { Memory } from "../../../domain/entity/memory";
import { Plan } from "../../../domain/entity/plan";
import { MediaRegistryForbiddenError } from "../../../error/media-registry-forbidden-error";
import { StorageMemoryGateway } from "../../../infra/gateway/memory/storage-memory-gateway";
import { MediaRegistryMemoryRepository } from "../../../infra/repository/memory/media-registry-memory-repository";
import { MemoryMemoryRepository } from "../../../infra/repository/memory/memory-memory-repository";
import { ReadMediaRegistryUseCase } from "../read-media-registry-use-case";

it("Should throw an error if the media was not founded", async () => {
  const storageGateway = new StorageMemoryGateway();
  const mediaRegistryRepository = new MediaRegistryMemoryRepository();
  const memoryMemoryRepository = new MemoryMemoryRepository();
  const readMediaRegistryUseCase = new ReadMediaRegistryUseCase(
    storageGateway,
    mediaRegistryRepository,
    memoryMemoryRepository,
  );
  expect(
    async () =>
      await readMediaRegistryUseCase.execute({
        mediaRegistryId: "123",
        session: { user: { id: "123" } },
      }),
  ).rejects.toThrow();
});

it("Should not allow to read media if user does not have permission", async () => {
  const storageGateway = new StorageMemoryGateway();
  const plan = Plan.create({
    currencyCode: "BRL",
    description: "test",
    name: "plan1",
    photosLimit: 3,
    priceCents: 4.9,
    videosLimit: 3,
    position: 1,
  });
  const memory = Memory.create({
    startDate: new Date(),
    name: "memoria#1",
    plan,
    userId: "123",
    isPrivate: false,
  });
  const mediaRegistry = MediaRegistry.create({
    memoryId: memory.getId(),
    mimetype: "image/png",
    personaId: "123",
    size: 123,
    userId: "123",
  });
  const memoryMemoryRepository = new MemoryMemoryRepository([memory]);
  const mediaRegistryRepository = new MediaRegistryMemoryRepository([
    mediaRegistry,
  ]);
  const readMediaRegistryUseCase = new ReadMediaRegistryUseCase(
    storageGateway,
    mediaRegistryRepository,
    memoryMemoryRepository,
  );
  expect(
    async () =>
      await readMediaRegistryUseCase.execute({
        mediaRegistryId: mediaRegistry.getId(),
        session: { user: { id: "1234" } },
      }),
  ).rejects.toThrow(MediaRegistryForbiddenError);
});

it("Should return url if the user has permissions to access the media", async () => {
  const storageGateway = new StorageMemoryGateway();
  const plan = Plan.create({
    currencyCode: "BRL",
    description: "test",
    name: "plan1",
    photosLimit: 3,
    priceCents: 4.9,
    videosLimit: 3,
    position: 1,
  });
  const memory = Memory.create({
    startDate: new Date(),
    name: "memoria#1",
    plan,
    userId: "123",
    isPrivate: false,
  });
  const mediaRegistry = MediaRegistry.create({
    memoryId: memory.getId(),
    mimetype: "image/png",
    personaId: "123",
    size: 123,
    userId: "123",
  });
  const memoryMemoryRepository = new MemoryMemoryRepository([memory]);
  const mediaRegistryRepository = new MediaRegistryMemoryRepository([
    mediaRegistry,
  ]);
  const readMediaRegistryUseCase = new ReadMediaRegistryUseCase(
    storageGateway,
    mediaRegistryRepository,
    memoryMemoryRepository,
  );
  const response = await readMediaRegistryUseCase.execute({
    mediaRegistryId: mediaRegistry.getId(),
    session: { user: { id: "123" } },
  });
  expect(response.url).toBeDefined();
});
