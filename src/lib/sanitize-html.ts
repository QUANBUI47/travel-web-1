import DOMPurify from "isomorphic-dompurify";

import { enrichYoutubeLinksInHtml } from "@/lib/youtube-embed";

const YOUTUBE_EMBED_SRC =
  /^https:\/\/(www\.)?(youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)[\w-]+/;

const TOUR_RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "h1",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "span",
    "div",
    "hr",
    "iframe",
  ],
  ALLOWED_ATTR: [
    "href",
    "target",
    "rel",
    "class",
    "id",
    "src",
    "title",
    "width",
    "height",
    "allow",
    "allowfullscreen",
    "frameborder",
    "referrerpolicy",
    "data-youtube-video",
  ],
  ALLOW_DATA_ATTR: true,
};

let youtubeSanitizeHookRegistered = false;

type DomNode = {
  getAttribute?: (name: string) => string | null;
  remove?: () => void;
};

function registerYoutubeSanitizeHook() {
  if (youtubeSanitizeHookRegistered) return;
  youtubeSanitizeHookRegistered = true;

  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName !== "iframe") return;

    const el = node as DomNode;
    const src = el.getAttribute?.("src");

    if (!src || !YOUTUBE_EMBED_SRC.test(src)) {
      el.remove?.();
    }
  });
}

registerYoutubeSanitizeHook();

/**
 * Sanitize HTML từ rich-text admin (TipTap) trước khi render công khai.
 */
export function sanitizeTourHtml(html: string | null | undefined): string {
  if (!html || typeof html !== "string") return "";

  const withEmbeds = enrichYoutubeLinksInHtml(html);
  const sanitized = DOMPurify.sanitize(withEmbeds, TOUR_RICH_TEXT_CONFIG);

  return enrichYoutubeLinksInHtml(sanitized);
}

/**
 * Chuỗi thuần cho meta description (bỏ thẻ HTML).
 */
export function plainTextFromHtml(
  html: string | null | undefined,
  maxLen = 200,
): string {
  const safe = sanitizeTourHtml(html);
  const text = safe
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLen) return text;

  return `${text.slice(0, maxLen - 1).trim()}…`;
}
