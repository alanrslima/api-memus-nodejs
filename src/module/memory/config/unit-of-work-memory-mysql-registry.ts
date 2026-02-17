import { RepositoryRegistry } from "../../common";
import { MemoryRepositories } from "../application/contract/memory-repositories";
import { GalleryMysqlRepository } from "../infra/repository/mysql/gallery-mysql-repository";
import { MemoryMysqlRepository } from "../infra/repository/mysql/memory-mysql-repository";
import { MemoryOrderMysqlRepository } from "../infra/repository/mysql/memory-order-mysql-repository";
import { MemoryPaymentMysqlRepository } from "../infra/repository/mysql/memory-payment-mysql-repository";
import { PlanMysqlRepository } from "../infra/repository/mysql/plan-mysql-repository";

const registry = new RepositoryRegistry<MemoryRepositories>();

registry.register(
  "memoryOrderRepository",
  (manager) => new MemoryOrderMysqlRepository(manager),
);
registry.register(
  "memoryRepository",
  (manager) => new MemoryMysqlRepository(manager),
);
registry.register(
  "galleryRepository",
  (manager) => new GalleryMysqlRepository(manager),
);
registry.register(
  "planRepository",
  (manager) => new PlanMysqlRepository(manager),
);
registry.register(
  "memoryPaymentRepository",
  (manager) => new MemoryPaymentMysqlRepository(manager),
);

export { registry as unityOfWorkMemoryRegistry };
