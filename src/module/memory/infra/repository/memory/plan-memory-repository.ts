import { PlanRepository } from "../../../application/contract/repository/plan-repository";
import { Plan } from "../../../domain/entity/plan";

export class PlanMemoryRepository implements PlanRepository {
  private data: Plan[];

  constructor(data?: Plan[]) {
    this.data = data || [];
  }

  setManager(): void {
    throw new Error("Method not implemented.");
  }

  async create(plan: Plan): Promise<void> {
    this.data.push(plan);
  }

  async getById(id: string): Promise<Plan> {
    const item = this.data.find((i) => i.getId() === id);
    if (!item) throw new Error("Plan not founded");
    return item;
  }

  async update(plan: Plan): Promise<void> {
    this.data = this.data.map((item) =>
      item.getId() === plan.getId() ? plan : item,
    );
  }
}
