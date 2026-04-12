import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

import { requireAdmin } from "@/lib/auth-guard";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof Error && error.message.startsWith("VIVU_")) {
      return error.message;
    }

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("[safe-action]", error);
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

/** Server actions that require an authenticated admin session. */
export const adminActionClient = actionClient.use(async ({ next }) => {
  await requireAdmin();

  return next();
});
