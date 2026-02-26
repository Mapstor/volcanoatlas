'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface VEIChartProps {
  distribution: Record<string, number>;
}

export default function VEIChart({ distribution }: VEIChartProps) {
  // Convert distribution object to array for chart
  const data = Object.entries(distribution).map(([vei, count]) => ({
    vei: vei === 'Unknown' ? 'Unknown' : `VEI ${vei}`,
    count,
    fullName: vei === 'Unknown' ? 'Unknown' : `VEI ${vei}`,
  }));

  // Sort by VEI level (Unknown at end)
  data.sort((a, b) => {
    if (a.vei === 'Unknown') return 1;
    if (b.vei === 'Unknown') return -1;
    return parseInt(a.vei.replace('VEI ', '')) - parseInt(b.vei.replace('VEI ', ''));
  });

  const getBarColor = (vei: string) => {
    if (vei === 'Unknown') return '#6b7280'; // gray
    const level = parseInt(vei.replace('VEI ', ''));
    const colors = [
      '#10b981', // VEI 0 - green
      '#34d399', // VEI 1
      '#fbbf24', // VEI 2 - yellow
      '#f59e0b', // VEI 3 - amber
      '#f97316', // VEI 4 - orange
      '#ef4444', // VEI 5 - red
      '#dc2626', // VEI 6 - dark red
      '#991b1b', // VEI 7 - darker red
      '#7f1d1d', // VEI 8 - darkest red
    ];
    return colors[level] || '#6b7280';
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Eruption Intensity Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis 
            dataKey="vei" 
            tick={{ fill: '#9ca3af' }}
            stroke="#374151"
          />
          <YAxis 
            tick={{ fill: '#9ca3af' }}
            stroke="#374151"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#f59e0b' }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value: any) => [`${value} eruptions`, 'Count']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.vei)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-400">
        <p>Total recorded eruptions: {Object.values(distribution).reduce((a, b) => a + b, 0)}</p>
        <p className="mt-1 text-xs">VEI = Volcanic Explosivity Index (0-8 scale)</p>
      </div>
    </div>
  );
}