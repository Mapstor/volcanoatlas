import Script from 'next/script';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  pageUrl: string;
  pageName?: string;
}

export default function FAQSchema({ faqs, pageUrl, pageName }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;
  
  const baseUrl = 'https://www.volcanosatlas.com';
  const fullUrl = pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`;
  
  // Clean HTML from answers for structured data
  const cleanAnswer = (text: string) => {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .trim();
  };
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${fullUrl}#faq`,
    name: pageName ? `${pageName} - Frequently Asked Questions` : 'Frequently Asked Questions',
    url: fullUrl,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanAnswer(faq.answer)
      }
    }))
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}