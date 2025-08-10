import React from "react";

export default function TransactionFrequencySkeleton() {
  const W = 420;
  const H = 180;
  const M = { left: 44, right: 12, top: 12, bottom: 14 };
  const CW = W - M.left - M.right;
  const CH = H - M.top - M.bottom;

  // Simple smooth placeholder path
  const fractions = [0.25, 0.45, 0.4, 0.75, 0.55, 0.62, 0.5, 0.68, 0.35, 0.42, 0.3];
  const stepX = fractions.length > 1 ? CW / (fractions.length - 1) : 0;
  const pts = fractions.map((f, i) => ({ x: i * stepX, y: CH * (1 - f) }));

  const buildSmooth = () => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y} L ${CW} ${pts[0].y}`;
    const t = 1;
    const path: string[] = [`M ${pts[0].x} ${pts[0].y}`];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1.x + ((p2.x - p0.x) / 6) * t;
      const c1y = p1.y + ((p2.y - p0.y) / 6) * t;
      const c2x = p2.x - ((p3.x - p1.x) / 6) * t;
      const c2y = p2.y - ((p3.y - p1.y) / 6) * t;
      path.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
    }
    return path.join(" ");
  };

  const line = buildSmooth();

  return (
    <section aria-hidden className="animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold font-[satoshi]">
          Transaction Frequency
        </h2>
        <div className="h-6 w-6 bg-gray-200 rounded" />
      </div>

      <div className="flex justify-between bg-white rounded-lg border border-gray-200 p-4 h-full">
        {/* Left summary skeleton */}
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>

        {/* Right graph skeleton */}
        <div className="w-full max-w-[520px]">
          <div className="mb-2 flex justify-center">
            <div className="h-6 w-40 bg-gray-200 rounded" />
          </div>

          <div className="h-48 sm:h-56 mb-4 relative">
            <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
              {/* Left y-axis label blocks */}
              {[0.3, 0.5, 0.8, 1].map((f, i) => {
                const y = M.top + (CH - f * CH) + 6;
                return (
                  <rect key={i} x={M.left - 36} y={y - 7} width={28} height={12} rx={2} fill="#E5E7EB" />
                );
              })}

              <g transform={`translate(${M.left}, ${M.top})`}>
                {/* Grid lines */}
                {[0.3, 0.5, 0.8].map((f, i) => {
                  const y = CH - f * CH;
                  return (
                    <line key={i} x1={0} x2={CW} y1={y} y2={y} stroke="#E5E7EB" strokeDasharray="4 4" strokeWidth="1" />
                  );
                })}

                {/* Placeholder line */}
                <path d={line} fill="none" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}