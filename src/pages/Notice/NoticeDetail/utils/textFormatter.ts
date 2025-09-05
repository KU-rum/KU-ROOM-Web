import type { FormattedParagraph } from "../types";

export const formatDescription = (description: string): FormattedParagraph[] => {
  if (!description) return [];

  // HTML을 분석해서 p태그와 span태그 구조 파악
  const parseHtmlContent = (html: string) => {
    // p 태그를 줄바꿈으로 처리하고, span 내용을 추출
    let processedHtml = html
      // 특수 문자 디코딩
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');

    // p태그를 줄바꿈으로 변환 (빈 p태그는 줄바꿈으로)
    processedHtml = processedHtml
      .replace(/<p[^>]*>\s*<\/p>/gi, '\n\n') // 빈 p태그 -> 두 줄바꿈 (문단 분리)
      .replace(/<p[^>]*>/gi, '\n\n')         // p태그 시작 -> 두 줄바꿈
      .replace(/<\/p>/gi, '')                // p태그 끝 제거
      .replace(/^\n+/, '')                   // 맨 앞의 줄바꿈 제거
      .replace(/\n{3,}/g, '\n\n');           // 3개 이상의 줄바꿈을 2개로 제한

    // span 태그 내용만 추출
    processedHtml = processedHtml
      .replace(/<span[^>]*>/gi, '')   // span 시작 태그 제거
      .replace(/<\/span>/gi, '');      // span 끝 태그 제거

    // 기타 HTML 태그 제거
    processedHtml = processedHtml
      .replace(/<[^>]*>/g, '')        // 나머지 HTML 태그 제거
      .replace(/\n\s*\n+/g, '\n\n')   // 중복 줄바꿈 정리
      .trim();

    return processedHtml;
  };

  const cleanText = parseHtmlContent(description);

  // 다양한 기준으로 문단 나누기
  const paragraphs = cleanText
    .replace(/\\\\/g, '\n\n')  // 백슬래시 두 개를 줄바꿈으로
    .replace(/\\/g, '\n')      // 백슬래시 하나를 줄바꿈으로
    .split(/(\s{2,}|\n{1,})/)  // 두 개 이상의 공백 또는 줄바꿈으로 분리
    .filter(p => p.trim().length > 0)
    .map(p => p.trim());

  const formattedParagraphs: FormattedParagraph[] = [];
  
  paragraphs.forEach((paragraph, index) => {
    const text = paragraph.trim();
    if (!text) return;

    // 다양한 패턴 감지
    if (/^[■□▶▷◆◇★☆●○◎◉▲△▽▼]+\s+/.test(text)) {
      formattedParagraphs.push({
        type: 'bullet',
        content: text,
        key: `bullet-${index}`
      });
    } else if (/^-\s+/.test(text)) {
      formattedParagraphs.push({
        type: 'dash-list',
        content: text.replace(/^-\s+/, ''),
        key: `dash-${index}`
      });
    } else if (/^❍/.test(text)) {
      formattedParagraphs.push({
        type: 'bullet',
        content: text,
        key: `circle-${index}`
      });
    } else if (/^【.*?】/.test(text)) {
      formattedParagraphs.push({
        type: 'special',
        content: text,
        key: `bracket-${index}`
      });
    } else if (/^※/.test(text)) {
      formattedParagraphs.push({
        type: 'notice',
        content: text,
        key: `notice-${index}`
      });
    } else if (/^\d+\.\s+/.test(text)) {
      formattedParagraphs.push({
        type: 'section',
        content: text,
        key: `section-${index}`
      });
    } else if (/^[가-힣]\.\s+/.test(text)) {
      formattedParagraphs.push({
        type: 'list',
        content: text,
        key: `list-${index}`
      });
    } else if (/^[①-⑳㉠-㉿]\s+/.test(text)) {
      formattedParagraphs.push({
        type: 'list',
        content: text,
        key: `circle-num-${index}`
      });
    } else if (text.length < 30 && /[:\.]$/.test(text)) {
      formattedParagraphs.push({
        type: 'subtitle',
        content: text,
        key: `subtitle-${index}`
      });
    } else {
      formattedParagraphs.push({
        type: 'paragraph',
        content: text,
        key: `paragraph-${index}`
      });
    }
  });

  return formattedParagraphs;
};