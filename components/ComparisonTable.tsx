interface ComparisonTableProps {
  title?: string;
  description?: string;
  headers?: string[];
  rows?: string[][];
  data?: {
    title: string;
    description?: string;
    headers: string[];
    rows: string[][];
  };
}

export default function ComparisonTable({ title, description, headers, rows, data }: ComparisonTableProps) {
  const tableTitle = title || data?.title || '';
  const tableDescription = description || data?.description;
  const tableHeaders = headers || data?.headers || [];
  const tableRows = rows || data?.rows || [];
  
  return (
    <div className="mb-12">
      {tableTitle && (
        <h3 className="text-xl font-bold text-white mb-2">{tableTitle}</h3>
      )}
      {tableDescription && (
        <p className="text-gray-400 mb-4">{tableDescription}</p>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-b border-gray-800">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#1a1a1a]">
            {tableRows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="border-b border-gray-800 hover:bg-[#252525] transition-all duration-200"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-6 py-4 text-sm ${
                      cellIndex === 0 
                        ? 'font-semibold text-white' 
                        : 'text-gray-300'
                    }`}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}