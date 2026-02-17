import { GalleryRepository } from "./repository/gallery-repository";
import { MemoryOrderRepository } from "./repository/memory-order-repository";
import { MemoryPaymentRepository } from "./repository/memory-payment-repository";
import { MemoryRepository } from "./repository/memory-repository";
import { PlanRepository } from "./repository/plan-repository";

export interface MemoryRepositories {
  memoryRepository: MemoryRepository;
  memoryOrderRepository: MemoryOrderRepository;
  galleryRepository: GalleryRepository;
  planRepository: PlanRepository;
  memoryPaymentRepository: MemoryPaymentRepository;
}
