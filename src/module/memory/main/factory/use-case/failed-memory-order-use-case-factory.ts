import { FailedMemoryOrderUseCase } from "../../../application/use-case/failed-memory-order-use-case";
import { unityOfWorkMemoryRegistry } from "../../../config/unit-of-work-memory-mysql-registry";
import { UnitOfWorkMemoryMysql } from "../../../infra/unit-of-work/unit-of-work-memory-mysql";

export const failedMemoryOrderUserCaseFactory = () => {
  const unitOfWork = new UnitOfWorkMemoryMysql(unityOfWorkMemoryRegistry);
  return new FailedMemoryOrderUseCase(unitOfWork);
};
