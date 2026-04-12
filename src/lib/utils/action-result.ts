type SafeActionFailure = {
  serverError?: string;
  validationErrors?: {
    _errors?: string[];
    [key: string]: { _errors?: string[] } | string[] | undefined;
  };
};

/** Resolve user-facing message from a next-safe-action result on the client. */
export function getSafeActionErrorMessage(
  result: SafeActionFailure,
  translate: (key: string) => string,
  fallback: string,
): string {
  if (result.serverError?.startsWith("VIVU_")) {
    const translated = translate(result.serverError);

    if (translated !== result.serverError) return translated;
  }

  const rootErrors = result.validationErrors?._errors;

  if (rootErrors?.[0]) return rootErrors[0];

  return fallback;
}
