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
                🍽️ Meals: {day.meals}
              </span>
            </div>

            <p className="text-gray-700 text-sm mb-3">{day.description}</p>

            {day.highlights && day.highlights.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">✨ Highlights:</h4>
                <ul className="space-y-1">
                  {day.highlights.map((highlight, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
