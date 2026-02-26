/**
 * Breaks up long paragraphs in HTML content into smaller, more readable chunks
 * @param html - The HTML content to process
 * @param maxSentences - Maximum number of sentences per paragraph (default: 3)
 * @returns Processed HTML with shorter paragraphs and proper spacing
 */
export function breakUpLongParagraphs(html: string, maxSentences: number = 3): string {
  if (!html) return '';

  // Helper function to split text into sentences
  const splitIntoSentences = (text: string): string[] => {
    // Temporarily replace common abbreviations
    const temp = text
      .replace(/Dr\./g, '___DR___')
      .replace(/Mr\./g, '___MR___')
      .replace(/Ms\./g, '___MS___')
      .replace(/Mrs\./g, '___MRS___')
      .replace(/U\.S\./g, '___US___')
      .replace(/U\.K\./g, '___UK___')
      .replace(/e\.g\./g, '___EG___')
      .replace(/i\.e\./g, '___IE___')
      .replace(/etc\./g, '___ETC___')
      .replace(/vs\./g, '___VS___');

    // Split on sentence endings
    const sentences = temp
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Restore abbreviations
    return sentences.map(s =>
      s.replace(/___DR___/g, 'Dr.')
        .replace(/___MR___/g, 'Mr.')
        .replace(/___MS___/g, 'Ms.')
        .replace(/___MRS___/g, 'Mrs.')
        .replace(/___US___/g, 'U.S.')
        .replace(/___UK___/g, 'U.K.')
        .replace(/___EG___/g, 'e.g.')
        .replace(/___IE___/g, 'i.e.')
        .replace(/___ETC___/g, 'etc.')
        .replace(/___VS___/g, 'vs.')
    );
  };

  // Process existing paragraph tags  
  let processedHtml = html.replace(/<p(?:\s[^>]*)?>([^]*?)<\/p>/g, (match, content) => {
    const sentences = splitIntoSentences(content);
    
    // If short enough, keep as is but ensure spacing
    if (sentences.length <= maxSentences) {
      return `<p class="mb-4">${content}</p>`;
    }

    // Break into multiple paragraphs
    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += maxSentences) {
      const chunk = sentences.slice(i, i + maxSentences).join(' ');
      if (chunk.trim()) {
        paragraphs.push(`<p class="mb-4">${chunk}</p>`);
      }
    }
    
    return paragraphs.join('\n');
  });

  // Process plain text that's not in tags
  const lines = processedHtml.split('\n');
  const finalLines: string[] = [];
  
  for (const line of lines) {
    // Skip if it's already an HTML tag
    if (line.trim().startsWith('<') || line.trim().length < 100) {
      finalLines.push(line);
      continue;
    }

    // Process long plain text
    const sentences = splitIntoSentences(line);
    
    if (sentences.length <= maxSentences) {
      // Wrap in paragraph with spacing
      finalLines.push(`<p class="mb-4">${line}</p>`);
    } else {
      // Break into multiple paragraphs
      for (let i = 0; i < sentences.length; i += maxSentences) {
        const chunk = sentences.slice(i, i + maxSentences).join(' ');
        if (chunk.trim()) {
          finalLines.push(`<p class="mb-4">${chunk}</p>`);
        }
      }
    }
  }

  // Ensure all p tags have proper spacing (in case some were missed)
  const result = finalLines.join('\n').replace(/<p>(.+?)<\/p>/g, '<p class="mb-4">$1</p>');
  
  return result;
}