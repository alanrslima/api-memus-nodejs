export enum MemoryStatus {
  /** produto está sendo criado, mas ainda não foi concluído. */
  DRAFT = "DRAFT",
  /** O cadastro foi concluído, mas o pagamento ainda não foi iniciado ou está aguardando confirmação. */
  PENDING_PAYMENT = "PENDING_PAYMENT",
  /** O usuário iniciou o pagamento (checkout aberto, aguardando retorno do gateway). */
  PAYMENT_IN_PROGRESS = "PAYMENT_IN_PROGRESS",
  /** O pagamento foi negado */
  PAYMENT_FAILED = "PAYMENT_FAILED",
  /** O produto foi pago e está ativo/publicado. */
  ACTIVE = "ACTIVE",
  /** O produto foi desativado manualmente pelo usuário ou pelo sistema. */
  INACTIVE = "INACTIVE",
  /** O produto foi suspenso por violação de política ou falha no pagamento recorrente. */
  SUSPENDED = "SUSPENDED",
  /** Produto arquivado permanentemente (sem exibição pública). */
  ARCHIVED = "ARCHIVED",
  /** Produto removido logicamente (soft delete). */
  DELETED = "DELETED",
}
