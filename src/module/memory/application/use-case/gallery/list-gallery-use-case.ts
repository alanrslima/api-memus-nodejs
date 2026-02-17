import { EntityId, PositiveNumber, UseCase } from "../../../../common";
import { ForbiddenError } from "../../../error/forbidden-error";
import { GalleryDTO } from "../../contract/dto/gallery-dto";
import { UnitOfWorkMemory } from "../../contract/unit-of-work-memory";

export class ListGalleryUseCase implements UseCase<Input, Output> {
  constructor(private readonly unitOfWorkMemory: UnitOfWorkMemory) {}

  async execute(input: Input): Promise<Output> {
    const page = input.page ?? 1;
    const peerPage = 50;
    const memory = await this.unitOfWorkMemory.execute(({ memoryRepository }) =>
      memoryRepository.getById(input.memoryId),
    );
    if (!memory.canAccess(input.userId)) throw new ForbiddenError();
    const gallery = await this.unitOfWorkMemory.execute(
      ({ galleryRepository }) =>
        galleryRepository.paginateByMemoryId(
          new EntityId(input.memoryId),
          new PositiveNumber(Number(page)),
          new PositiveNumber(Number(peerPage)),
        ),
    );
    return gallery;
  }
}

type Input = {
  userId: string;
  memoryId: string;
  page?: number;
};

type Output = GalleryDTO;
