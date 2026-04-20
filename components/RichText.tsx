import { processContent } from '@/lib/textUtils';

interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  const processed = processContent(html);
  return <div className={className} dangerouslySetInnerHTML={{ __html: processed }} />;
}