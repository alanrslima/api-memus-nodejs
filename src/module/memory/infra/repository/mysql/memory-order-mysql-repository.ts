import { EntityManager } from "typeorm";
import { MemoryOrderRepository } from "../../../application/contract/repository/memory-order-repository";
import { MemoryOrder } from "../../../domain/entity/memory-order";
import { MemoryOrderNotFoundError } from "../../../error/memory-order-not-found-error";
import { MemoryOrderMapper } from "./mapper/memory-order-mapper";

export class MemoryOrderMysqlRepository implements MemoryOrderRepository {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  setManager(manager: EntityManager): void {
    this.manager = manager;
  }

  async getById(id: string): Promise<MemoryOrder> {
    const sql = `SELECT id, memory_id, status, plan_snapshot, currency_code, price, discount, total, user_id FROM memory_order WHERE id = ?`;
    const [response] = await this.manager.query(sql, [id]);
    if (!response) throw new MemoryOrderNotFoundError();
    return MemoryOrderMapper.toEntity(response);
  }

  async create(memoryOrder: MemoryOrder): Promise<void> {
    const sql = `INSERT INTO memory_order 
    (id, memory_id, user_id, status, plan_snapshot, currency_code, price, discount, total) 
    VALUES (?,?,?,?,?,?,?,?,?)`;
    const data = MemoryOrderMapper.toPersistence(memoryOrder);
    await this.manager.query(sql, [
      data.id,
      data.memory_id,
      data.user_id,
      data.status,
      JSON.stringify(data.plan_snapshot),
      data.currency_code,
      data.price,
      data.discount,
      data.total,
    ]);
  }

  async update(memoryOrder: MemoryOrder): Promise<void> {
    const sql = `UPDATE memory_order SET 
      memory_id = ?, 
      user_id = ?, 
      status = ?, 
      currency_code = ?, 
      price = ?, 
      discount = ?, 
      total = ? 
    WHERE id = ?`;
    const data = MemoryOrderMapper.toPersistence(memoryOrder);
    await this.manager.query(sql, [
      data.memory_id,
      data.user_id,
      data.status,
      data.currency_code,
      data.price,
      data.discount,
      data.total,
      data.id,
    ]);
  }
}
