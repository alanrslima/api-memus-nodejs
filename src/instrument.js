// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

// if (process.env.NODE_ENV === "production") 

Sentry.init({
  dsn: "https://16f7ffe4d3a7d1e59722150b8653ed19@o4509664747454464.ingest.us.sentry.io/4510948121968640",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: process.env.NODE_ENV,
  dns: process.env.SENTRY_DSN
});