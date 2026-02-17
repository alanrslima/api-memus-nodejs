export enum PaymentStatus {
  PENDING = "PENDING", // Criado mas ainda não confirmado
  REQUIRES_ACTION = "REQUIRES_ACTION", // 3DS ou autenticação extra
  PROCESSING = "PROCESSING", // Em processamento pelo gateway
  SUCCEEDED = "SUCCEEDED", // Pago com sucesso
  FAILED = "FAILED", // Falha definitiva
  CANCELED = "CANCELED", // Cancelado pelo usuário ou sistema
  REFUNDED = "REFUNDED", // Totalmente reembolsado
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  CHARGEBACK = "CHARGEBACK", // Contestação/disputa
}
