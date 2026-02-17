import { BaseRepository } from "../../../../common/application/contract/base-repository";
import { MemoryPayment } from "../../../domain/entity/memory-payment";

export interface MemoryPaymentRepository extends BaseRepository {
  create(memoryPayment: MemoryPayment): Promise<void>;
}
