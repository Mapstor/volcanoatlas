import { processContent } from '@/lib/textUtils';
import { fixInternalLinks } from '@/lib/routes';

interface RichTextProps {
  html: string;
  className?: string;
}

/**
 * Server component. Turns wiki-link and bold markup into HTML, then checks every
 * internal link against the pages that really exist (dead targets become plain text).
 */
export function RichText({ html, className }: RichTextProps) {
  const processed = fixInternalLinks(processContent(html));
  return <div className={className} dangerouslySetInnerHTML={{ __html: processed }} />;
}
