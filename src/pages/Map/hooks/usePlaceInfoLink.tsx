import { ReactNode, useMemo } from "react";

const URL_REGEX = /\bhttps?:\/\/[^\s<>()]+/gi;

function trimTrailingPunct(url: string) {
  return url.replace(/[)\]}>,.;:"'!?]+$/g, "");
}

function linkify(text: string) {
  const elements: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const rawUrl = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      elements.push(text.slice(lastIndex, start));
    }

    const cleanUrl = trimTrailingPunct(rawUrl);
    const trailing = rawUrl.slice(cleanUrl.length);

    elements.push(
      <a
        key={`${start}-${cleanUrl}`}
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#009733", textDecoration: "underline" }}
      >
        {cleanUrl}
      </a>,
    );

    if (trailing) {
      elements.push(trailing);
    }

    lastIndex = start + rawUrl.length;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

export const usePlaceInfoLink = (info: string) => {
  return useMemo(() => {
    if (!info) return [];
    return linkify(info);
  }, [info]);
};
