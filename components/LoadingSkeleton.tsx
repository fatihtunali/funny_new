export function PackageCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-300"></div>

      {/* Content skeleton */}
      <div className="p-6">
        {/* Duration */}
        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>

        {/* Title */}
        <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>

        {/* Description */}
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>

        {/* Button */}
        <div className="h-10 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
}

export function PackageGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PackageCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PackageDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero Image Skeleton */}
      <div className="relative h-[50vh] min-h-[400px] bg-gray-300"></div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>

            {/* Description */}
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>

            {/* Itinerary */}
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-4">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="h-8 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-16 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-12 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-300 rounded w-full"></div>
      <div className="h-10 bg-gray-300 rounded w-full"></div>
      <div className="h-24 bg-gray-300 rounded w-full"></div>
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg animate-pulse">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: cols }).map((_, colIdx) => (
                <td key={colIdx} className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
