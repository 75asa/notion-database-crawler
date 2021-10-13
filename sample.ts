import * as Sentry from "@sentry/node";
// or use es6 import statements
// import * as Sentry from '@sentry/node';

import * as Tracing from "@sentry/tracing";
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

import { Config } from "./src/Config";

const { DSN } = Config.Sentry;

Sentry.init({
  dsn: DSN,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({
      tracing: true,
    }),
  ],
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My 2nd Test Transaction",
});

Sentry.configureScope((scope) => {
  scope.setSpan(transaction);
});

setTimeout(() => {
  try {
    // foo();
    throw new Error("Oops!");
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);
