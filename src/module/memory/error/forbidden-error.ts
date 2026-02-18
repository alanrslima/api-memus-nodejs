import { BaseError, BaseErrorSerializeProps } from "../../common";

export class ForbiddenError extends BaseError {
  statusCode = 403;

  constructor() {
    super("Forbidden error");
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serialize(): BaseErrorSerializeProps {
    return [
      {
        message: "O usuário não possui permissão para acessar este recurso.",
      },
    ];
  }
}
