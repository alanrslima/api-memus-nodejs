import "express-async-errors";
import "../infra/observability/sentry";
import Sentry from "@sentry/node";

import http from "http";
import express from "express";

import { setupMiddleware } from "./middleware";
import { errorHandler } from "../middleware/error-handler";

import { authRouter } from "../../module/auth";
import { memoryRouter } from "../../module/memory";
import { geolocationRouter } from "../../module/geolocation";
import { setupEventListener } from "./event-listener";

const app = express();

// const server = https.createServer(
//   {
//     maxHeaderSize: 1024 * 1024,
//     cert: fs.readFileSync("certificates/cert.pem"),
//     key: fs.readFileSync("certificates/key.pem"),
//   },
//   app
// );

const server = http.createServer({ maxHeaderSize: 1024 * 1024 }, app);

setupMiddleware(app);
setupEventListener();

app.use("/api/auth", authRouter);
app.use("/api/memory", memoryRouter);
app.use("/api/geolocation", geolocationRouter);

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

export default server;
