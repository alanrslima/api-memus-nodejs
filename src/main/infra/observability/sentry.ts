import Sentry from "@sentry/node";
import { env } from "../../../module/common";

export function setupSentry() {
  if (env.SENTRY_DSN) {
    Sentry.init({
      sendDefaultPii: true,
      environment: env.NODE_ENV,
      dsn: env.SENTRY_DSN,
    });
  }
}
