export default function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
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
    )
  }

  