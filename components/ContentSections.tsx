import { breakUpLongParagraphs } from '@/lib/textUtils';

interface ContentSectionsProps {
  sections: {
    [key: string]: {
      title: string;
      content: string;
    }
  }
}

export default function ContentSections({ sections }: ContentSectionsProps) {
  // Convert section keys to readable titles
  const formatTitle = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      {Object.entries(sections).map(([key, section]) => (
        <div key={key} className="prose prose-lg prose-invert max-w-none mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="w-1 h-8 bg-amber-500 mr-3"></span>
            {section.title || formatTitle(key)}
          </h2>
          <div 
            className="text-gray-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: breakUpLongParagraphs(section.content, 3) }}
          />
        </div>
      ))}
    </>
  );
}