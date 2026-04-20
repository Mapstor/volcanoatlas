import { processWikiLinks } from '@/lib/textUtils';

interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  const processed = processWikiLinks(html);
  return <div className={className} dangerouslySetInnerHTML={{ __html: processed }} />;
}