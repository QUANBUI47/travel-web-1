import { getTranslations } from "next-intl/server";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Xử lý lỗi tập trung cho Server Actions
 */
export async function handleError(
  error: unknown,
  defaultMessage: string = "action_failed",
): Promise<ActionResponse> {
  const tApi = await getTranslations("API");
  const tCommon = await getTranslations("Common");

  // eslint-disable-next-line no-console
  console.error("Action Error:", error);

  // Nếu lỗi đã có cấu trúc trả về từ trước (success: false)
  if (
    error !== null &&
    typeof error === "object" &&
    "success" in error &&
    error.success === false
  ) {
    return error as ActionResponse;
  }

  // Lấy message từ error object hoặc dùng default
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Thử tra cứu xem errorMessage có phải là một Key trong file ngôn ngữ không
  let translatedMessage = defaultMessage;

  try {
    // Nếu defaultMessage là i18n key thì dịch luôn
    const resolveKey = (key: string) => {
      try {
        const fromApi = tApi(key);

        if (fromApi && fromApi !== key) return fromApi;
      } catch {
        /* key not in API namespace */
      }

      try {
        const fromCommon = tCommon(key);

        if (fromCommon && fromCommon !== key) return fromCommon;
      } catch {
        /* key not in Common namespace */
      }

      return key;
    };

    translatedMessage = resolveKey(defaultMessage);

    const translation = resolveKey(errorMessage);

    if (translation && translation !== errorMessage) {
      translatedMessage = translation;
    }
  } catch {
    // Nếu không dịch được thì giữ nguyên defaultMessage
  }

  return {
    success: false,
    error: errorMessage,
    message: translatedMessage,
  };
}
