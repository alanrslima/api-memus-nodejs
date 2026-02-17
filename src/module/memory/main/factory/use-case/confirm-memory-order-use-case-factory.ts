import { ConfirmMemoryOrderUseCase } from "../../../application/use-case/confirm-memory-order-use-case";
import { unityOfWorkMemoryRegistry } from "../../../config/unit-of-work-memory-mysql-registry";
import { UnitOfWorkMemoryMysql } from "../../../infra/unit-of-work/unit-of-work-memory-mysql";

export const confirmMemoryOrderUserCaseFactory = () => {
  const unitOfWork = new UnitOfWorkMemoryMysql(unityOfWorkMemoryRegistry);
  return new ConfirmMemoryOrderUseCase(unitOfWork);
};
