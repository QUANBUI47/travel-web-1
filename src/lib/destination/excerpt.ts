import { plainTextFromHtml } from "@/lib/sanitize-html";

/** Một câu mở đầu cho hero — không lặp toàn bộ bài dưới. */
export function getDestinationHeroTagline(
  html: string | null | undefined,
  maxLen = 160,
): string {
  const text = plainTextFromHtml(html, 600);

  if (!text) return "";

  const sentenceMatch = text.match(/^[^.!?…]+[.!?…]?/);
  const firstSentence = (sentenceMatch?.[0] ?? text).trim();

  if (firstSentence.length <= maxLen) return firstSentence;

  return `${firstSentence.slice(0, maxLen - 1).trim()}…`;
}
