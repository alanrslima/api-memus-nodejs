export enum OrderStatus {
  /** Pagamento criado, mas ainda não iniciado. */
  PENDING = "PENDING",
  /** Pagamento em processamento pelo gateway (ex: aguardando resposta da adquirente). */
  PROCESSING = "PROCESSING",
  /** Pagamento autorizado, mas ainda não capturado (usado em cartão de crédito). */
  AUTHORIZED = "AUTHORIZED",
  /** Pagamento confirmado e o valor foi capturado (transação concluída). */
  CAPTURED = "CAPTURED",
  /** Pagamento aguardando confirmação do cliente (ex: boleto emitido, PIX agendado). */
  WAITING_PAYMENT = "WAITING_PAYMENT",
  /** Pagamento expirou (tempo limite atingido sem conclusão). */
  EXPIRED = "EXPIRED",
  /** Valor devolvido ao cliente (reembolso total). */
  REFUNDED = "REFUNDED",
  /** Reembolso parcial realizado. */
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  /** O cliente contestou o pagamento (disputa aberta). */
  CHARGEBACK = "CHARGEBACK",
  /** Pagamento cancelado antes da captura ou conclusão. */
  CANCELED = "CANCELED",
  /** Pagamento recebido com sucesso e confirmado. */
  PAYMENT_SUCCEEDED = "PAYMENT_SUCCEEDED",
  /** Pagamento falhou (erro de gateway, cartão recusado, etc). */
  PAYMENT_FAILED = "PAYMENT_FAILED",
}
