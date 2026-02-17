import { EntityManager } from "typeorm";
import { MemoryPaymentRepository } from "../../../application/contract/repository/memory-payment-repository";
import { MemoryPayment } from "../../../domain/entity/memory-payment";
import { MemoryPaymentMapper } from "./mapper/memory-payment-mapper";

export class MemoryPaymentMysqlRepository implements MemoryPaymentRepository {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  setManager(manager: EntityManager): void {
    this.manager = manager;
  }

  async create(memoryPayment: MemoryPayment): Promise<void> {
    const sql = `INSERT INTO memory_payment 
    (id, order_id, provider, provider_payment_id, currency_code, amount, status) 
    VALUES (?,?,?,?,?,?,?,?,?)`;
    const data = MemoryPaymentMapper.toPersistence(memoryPayment);
    await this.manager.query(sql, [
      data.id,
      data.order_id,
      data.provider,
      data.provider_payment_id,
      data.currency_code,
      data.amount,
      data.status,
    ]);
  }
}
