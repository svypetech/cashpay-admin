export default function StatCard({ icon, label, value, isLoading }: { icon: string; label: string; value: number, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border-[1px] border-[#0000001A] px-4 py-8">
        <div className="flex items-center space-x-3">
          {/* Icon skeleton */}
          <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            {/* Label skeleton */}
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
            {/* Value skeleton */}
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-[1px] border-[#0000001A] px-4 py-8">
      <div className="flex items-center space-x-3">
        <img src={icon} alt={label} className="h-12 w-12" />
        <div>
          <p className="text-sm text-black font-[satoshi]">{label}</p>
          <p className="text-xl font-bold text-primary font-[satoshi]">{value}</p>
        </div>
      </div>
    </div>
  );
}

