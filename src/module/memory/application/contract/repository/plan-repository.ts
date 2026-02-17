import { BaseRepository } from "../../../../common/application/contract/base-repository";
import { Plan } from "../../../domain/entity/plan";

export interface PlanRepository extends BaseRepository {
  getById(id: string): Promise<Plan>;
  create(plan: Plan): Promise<void>;
  update(plan: Plan): Promise<void>;
}
