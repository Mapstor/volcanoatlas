/**
 * Server-rendered JSON-LD. A plain <script> tag so the markup is in the HTML
 * that crawlers download (next/script injected it after page load, which most
 * crawlers never see). Only put facts here that are also visible on the page.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

const BASE = 'https://www.volcanosatlas.com';

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

export function faqLd(faqs: Array<{ question: string; answer: string }>) {
  const clean = (text: string) =>
    text
      .replace(/\[\[(?:\w+:)?[^|\]]+\|([^\]]+)\]\]/g, '$1')
      .replace(/\[\[(?:\w+:)?([^\]]+)\]\]/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/\*\*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: clean(faq.question),
      acceptedAnswer: { '@type': 'Answer', text: clean(faq.answer) },
    })),
  };
}
