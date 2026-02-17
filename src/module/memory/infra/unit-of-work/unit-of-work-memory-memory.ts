import { UnitOfWork } from "../../../common";
import { MemoryRepositories } from "../../application/contract/memory-repositories";
import { MemoryMemoryRepository } from "../repository/memory/memory-memory-repository";
import { MemoryOrderMemoryRepository } from "../repository/memory/memory-order-memory-repository";

export class UnitOfWorkMemoryMemory<
  TRepositories extends { [K in keyof MemoryRepositories]: any },
> implements UnitOfWork<TRepositories> {
  private repositories: TRepositories;

  constructor(initial?: Partial<TRepositories>) {
    this.repositories = {
      memoryOrderRepository: new MemoryOrderMemoryRepository(),
      memoryRepository: new MemoryMemoryRepository(),
      ...(initial as Partial<TRepositories>),
    } as TRepositories;
  }

  async execute<T>(work: (repos: TRepositories) => Promise<T>): Promise<T> {
    return work(this.repositories);
  }

  push(repos: Partial<TRepositories>) {
    this.repositories = { ...this.repositories, ...repos };
  }
}
