export enum PaymentStatus {
  PENDING = "pending", // Criado mas ainda não confirmado
  REQUIRES_ACTION = "requires_action", // 3DS ou autenticação extra
  PROCESSING = "processing", // Em processamento pelo gateway
  SUCCEEDED = "succeeded", // Pago com sucesso
  FAILED = "failed", // Falha definitiva
  CANCELED = "canceled", // Cancelado pelo usuário ou sistema
  REFUNDED = "refunded", // Totalmente reembolsado
  PARTIALLY_REFUNDED = "partially_refunded",
  CHARGEBACK = "chargeback", // Contestação/disputa
}
