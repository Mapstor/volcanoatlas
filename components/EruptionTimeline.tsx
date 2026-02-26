'use client';

interface TimelineEvent {
  year: number;
  vei: number | null;
  label: string;
  deaths: number | null;
  notable: boolean;
}

interface EruptionTimelineProps {
  events?: TimelineEvent[];
  timeline?: TimelineEvent[];
}

export default function EruptionTimeline({ events, timeline }: EruptionTimelineProps) {
  // Handle both prop names for compatibility
  const timelineEvents = events || timeline || [];
  
  // Return early if no events
  if (!timelineEvents || timelineEvents.length === 0) {
    return null;
  }
  
  // Sort events by year descending (most recent first)
  const sortedEvents = [...timelineEvents].sort((a, b) => b.year - a.year);
  
  // Take only the most recent 20 events for display
  const displayEvents = sortedEvents.slice(0, 20);

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Eruption Timeline</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
        
        <div className="space-y-6">
          {displayEvents.map((event, index) => (
            <div key={index} className="relative flex items-start">
              {/* Dot */}
              <div className={`absolute left-8 w-3 h-3 rounded-full transform -translate-x-1/2 ${
                event.notable ? 'bg-amber-500' : 'bg-gray-600'
              } ${event.notable ? 'ring-4 ring-amber-500/20' : ''}`}></div>
              
              {/* Content */}
              <div className="ml-16 flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg font-semibold text-white">
                        {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                      </span>
                      {event.vei !== null && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">
                          VEI {event.vei}
                        </span>
                      )}
                      {event.notable && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-medium">
                          Notable
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{event.label}</p>
                    {event.deaths !== null && event.deaths > 0 && (
                      <p className="text-red-400 text-sm mt-1">
                        {event.deaths.toLocaleString()} deaths
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {timelineEvents.length > 20 && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            Showing most recent 20 of {timelineEvents.length} recorded eruptions
          </div>
        )}
      </div>
    </div>
  );
}