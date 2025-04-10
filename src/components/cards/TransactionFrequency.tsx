import Image from "next/image"
import Link from "next/link"

export default function TransactionFrequency() {
  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold font-[satoshi]">Transaction Frequency</h2>
        <Link href="/transaction-frequency">
          <Image
            src="/icons/export-arrow.svg"
            alt="Arrow right"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="flex justify-between bg-white rounded-lg border border-gray-200 p-4 h-full">

        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="text-lg font-[satoshi] text-gray-500">THIS MONTH</div>
          <div className="text-4xl font-bold font-[satoshi]">12032</div>
        </div>

        <div>
        <div className="mb-2 flex justify-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-[satoshi]">Today</span>
            <div className="flex items-center">
              <span className="font-medium">5602</span>
              <span className="text-xs bg-[#71FB5533] text-primary font-semibold py-1 px-2 rounded-sm ml-2">+3.6%</span>
            </div>
          </div>
        </div>

        <div className="h-32 mb-4 relative">
          
          <div className="absolute left-0 top-[50%] transform -translate-y-1/2 text-black font-extralight text-xs">
            1000
          </div>
          <div className="absolute left-0 top-[34%] transform -translate-y-1/2 text-black font-extralight text-xs">
            5000
          </div>
          <div className="absolute left-0 top-[17%] transform -translate-y-1/2 text-black font-extralight text-xs">
            10000
          </div>
          <div className="absolute left-0 top-0 transform -translate-y-1/2 text-black font-extralight text-xs">
            15000
          </div>
          
          <Image
            src="/icons/graph.svg"
            alt="Transaction frequency chart"
            width={300}
            height={128}
            className="w-full h-full"
          />
          {/* Replace with actual SVG chart */}
        </div>
        </div>
      </div>
    </section>
  )
}
