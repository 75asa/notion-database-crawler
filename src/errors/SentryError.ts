import * as Sentry from "@sentry/node";

import { Config } from "../Config";

const { DSN } = Config.Sentry;

Sentry.init({
  dsn: DSN,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

type SentryData = any;

export class SentryError extends Error {
  #TYPE = "error";
  #CATEGORY = "data";
  #DENY_LIST = [/email/gi, /name/gi, /address/gi];
  constructor(message: string, data: SentryData) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SentryError);
    }

    this.name = "SentryError";

    Sentry.addBreadcrumb({
      category: this.#CATEGORY,
      message,
      data: this.#redactSensitiveInformation(data),
      type: this.#TYPE,
      level: Sentry.Severity.Debug,
    });

    Sentry.captureException(message);
  }

  #redactSensitiveInformation(data: SentryData) {
    // if (!(data instanceof Object)) return {};
    // if (!(data instanceof Object) || !(data instanceof Array)) return {};
    // if (typeof data !== "object") return {};
    const keys = Object.keys(data);
    const safeData: { [index: string]: any } = {};

    for (const key of keys) {
      if (!Array.isArray(data[key]) && typeof data[key] === "object") {
        // recursively check deep nested children
        safeData[key] = this.#redactSensitiveInformation(data[key]);
      } else if (this.#DENY_LIST.some((regex) => regex.test(key))) {
        // redacted the data
        safeData[key] = "[REDACTED]";
      } else {
        // assign data to object to send to Sentry
        safeData[key] = data[key];
      }
    }
    return safeData;
  }
}
