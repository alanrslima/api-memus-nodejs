import { BaseError, BaseErrorSerializeProps } from "../../common";

export class MemoryPaymentNotFoundError extends BaseError {
  statusCode = 400;

  constructor() {
    super("Memory Payment not found");
    Object.setPrototypeOf(this, MemoryPaymentNotFoundError.prototype);
  }

  serialize(): BaseErrorSerializeProps {
    return [
      {
        message: "Pagamento de memória não escontrado",
      },
    ];
  }
}
