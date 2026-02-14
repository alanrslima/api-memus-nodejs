import { type Express } from "express";
import { bodyParser } from "../middleware/body-parser";
import { cors } from "../middleware/cors";
import { contentType } from "../middleware/content-type";
import { requestTime } from "../middleware/request-time";
import { httpLogger } from "../middleware/http-logger";

export const setupMiddleware = (app: Express): void => {
  app.use((req, res, next) => {
    if (req.originalUrl === "/api/memory/stripe-webhook") {
      next();
    } else {
      bodyParser(req, res, next);
    }
  });
  app.use(cors);
  app.use(contentType);
  app.use(requestTime);
  app.use(httpLogger);
};
