/** Extract YouTube video id from watch, shorts, embed, or youtu.be URLs. */
export function parseYoutubeVideoId(url: string): string | null {
  const trimmed = url.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
    /youtube\.com\/watch\?.*v=([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);

    if (match?.[1]) return match[1];
  }

  return null;
}

export function buildYoutubeEmbedHtml(videoId: string): string {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return `<div data-youtube-video=""><iframe src="${src}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0"></iframe></div>`;
}

/** Turn plain YouTube links in HTML into embed blocks (legacy content saved as <a> or bare URL). */
export function enrichYoutubeLinksInHtml(html: string): string {
  if (!html) return html;

  let result = html;

  result = result.replace(
    /<a[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi,
    (match, href: string) => {
      const id = parseYoutubeVideoId(href);

      return id ? buildYoutubeEmbedHtml(id) : match;
    },
  );

  result = result.replace(
    /<p>\s*(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[^\s<]+)\s*<\/p>/gi,
    (_match, url: string) => {
      const id = parseYoutubeVideoId(url);

      return id ? buildYoutubeEmbedHtml(id) : _match;
    },
  );

  return result;
}
