import { Controller, MysqlDataSource } from "../../../../common";
import { SelectMemoryPlanUseCase } from "../../../application/use-case/select-memory-plan-use-case";
import { MemoryMysqlRepository } from "../../../infra/repository/mysql/memory-mysql-repository";
import { PlanMysqlRepository } from "../../../infra/repository/mysql/plan-mysql-repository";
import { SelectMemoryPlanController } from "../../../presentation/controller/select-memory-plan-controller";

export const selectMemoryPlanControllerFactory = (): Controller => {
  const manager = MysqlDataSource.getInstance().getQueryRunner().manager;
  const memoryRepository = new MemoryMysqlRepository(manager);
  const planRepository = new PlanMysqlRepository(manager);
  const selectMemoryPlanUseCase = new SelectMemoryPlanUseCase(
    memoryRepository,
    planRepository,
  );
  const controller = new SelectMemoryPlanController(selectMemoryPlanUseCase);
  return controller;
};
