interface ItineraryDay {
  day: number;
  title: string;
  meals: string;
  description: string;
  highlights?: string[];
}

interface Props {
  itinerary: ItineraryDay[];
}

export default function ItineraryTimeline({ itinerary }: Props) {
  return (
    <div className="space-y-6">
      {itinerary.map((day) => (
        <div key={day.day} className="relative pl-8 pb-8 border-l-2 border-primary-200 last:border-l-0 last:pb-0">
          {/* Day number badge */}
          <div className="absolute -left-6 top-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
            {day.day}
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4 ml-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">{day.title}</h3>
              <span className="inline-flex items-center text-sm font-semibold text-primary-600 mt-1 md:mt-0">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Meals: {day.meals}
              </span>
            </div>

            <p className="text-gray-700 text-sm mb-3">{day.description}</p>

            {day.highlights && day.highlights.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">Highlights:</p>
                <div className="flex flex-wrap gap-2">
                  {day.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
