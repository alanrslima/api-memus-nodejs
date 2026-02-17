import { MemoryPaymentRepository } from "../../../application/contract/repository/memory-payment-repository";
import { MemoryPayment } from "../../../domain/entity/memory-payment";

export class MemoryPaymentMemoryRepository implements MemoryPaymentRepository {
  public data: MemoryPayment[];

  constructor(mock?: MemoryPayment[]) {
    this.data = mock || [];
  }

  setManager(): void {
    throw new Error("Method not implemented.");
  }

  async getById(id: string): Promise<MemoryPayment | undefined> {
    const item = this.data.find((i) => i.getId() === id);
    return item;
  }

  async create(memoryPayment: MemoryPayment): Promise<void> {
    this.data.push(memoryPayment);
  }

  async update(memoryPayment: MemoryPayment): Promise<void> {
    this.data = this.data.map((item) =>
      item.getId() === memoryPayment.getId() ? memoryPayment : item,
    );
  }
}
