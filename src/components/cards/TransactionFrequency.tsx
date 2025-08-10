import Image from "next/image";
import Link from "next/link";

type TxPoint = { date: string; count: number };
type TxFrequencyData = {
  past45DaysTransaction: TxPoint[];
  monthlyTransactionCount: number;
  dailyTransactionCount: number;
};

type Props = {
  data: TxFrequencyData;
};

function niceMax(maxVal: number) {
  if (maxVal <= 0) return 1;
  const exp = Math.floor(Math.log10(maxVal));
  const base = Math.pow(10, exp);
  const n = maxVal / base;
  let nice = 1;
  if (n <= 1) nice = 1;
  else if (n <= 2) nice = 2;
  else if (n <= 5) nice = 5;
  else nice = 10;
  return nice * base;
}

// Smooth (Catmull–Rom -> cubic Bezier)
function buildSmoothPath(points: number[], w: number, h: number, yMax: number) {
  const n = points.length;
  if (n === 0) return { line: "", area: "" };

  const stepX = n > 1 ? w / (n - 1) : 0;
  const toY = (v: number) => h - (yMax === 0 ? 0 : (v / yMax) * h);

  const pts = points.map((v, i) => ({ x: i * stepX, y: toY(v) }));

  if (pts.length === 1) {
    const p = pts[0];
    const line = `M ${p.x} ${p.y} L ${w} ${p.y}`;
    const area = `${line} L ${w} ${h} L 0 ${h} Z`;
    return { line, area };
  }

  const path: string[] = [];
  path.push(`M ${pts[0].x} ${pts[0].y}`);

  const t = 1;
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

  const line = path.join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z` ;
  return { line, area };
}

function toAscByDate(data: TxPoint[]) {
  return [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export default function TransactionFrequency({ data }: Props) {
  const seriesAsc = toAscByDate(data?.past45DaysTransaction ?? []);
  const values = seriesAsc.map((p) => p.count);

  // Dynamic Y domain based strictly on 45-day series
  const maxVal45 = Math.max(0, ...values);
  const yMax = niceMax(maxVal45);

  // Tick values like 30/50/80/100% of yMax
  const tickFractions = [0.3, 0.5, 0.8, 1];
  const tickValues = tickFractions.map((f) => Math.round(yMax * f));

  const todayCount = data?.dailyTransactionCount ?? 0;

  // Today index assumed last in series
  const todayIdx = Math.max(0, seriesAsc.length - 1);
  const prevVal = todayIdx > 0 ? seriesAsc[todayIdx - 1].count : 0;
  const diff = todayCount - prevVal;
  const pct =
    prevVal === 0 ? (todayCount > 0 ? 100 : 0) : (diff / prevVal) * 100;
  const pctStr = `${diff >= 0 ? "+" : ""}${pct.toFixed(1)}%`;

  // SVG geometry with margins so grid doesn't sit under y-axis labels
  const W = 320;
  const H = 140;
  const M = { left: 36, right: 8, top: 10, bottom: 10 }; // add left margin for labels
  const CW = W - M.left - M.right;
  const CH = H - M.top - M.bottom;

  const { line, area } = buildSmoothPath(values, CW, CH, yMax);
  const stepX = seriesAsc.length > 1 ? CW / (seriesAsc.length - 1) : 0;
  const xToday = todayIdx * stepX;
  // Keep the dot aligned with the line by using the series value
  const yToday =
    CH - (yMax === 0 ? 0 : ((seriesAsc[todayIdx]?.count ?? 0) / yMax) * CH);

  const yForValue = (v: number) => CH - (yMax === 0 ? 0 : (v / yMax) * CH);

  // Labels sit slightly below the grid lines (labelYOffset)
  const labelX = M.left - 8;
  const labelYOffset = 4;

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold font-[satoshi]">
          Transaction Frequency
        </h2>
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
          <div className="text-4xl font-bold font-[satoshi]">
            {data?.monthlyTransactionCount ?? 0}
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-[satoshi]">
                Today
              </span>
              <div className="flex items-center">
                <span className="font-medium">{todayCount}</span>
                <span
                  className={`text-xs font-semibold py-1 px-2 rounded-sm ml-2 ${
                    diff >= 0
                      ? "bg-[#71FB5533] text-primary"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {pctStr}
                </span>
              </div>
            </div>
          </div>

          <div className="h-32 mb-4 relative">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-full"
            >
              <defs>
                <pattern
                  id="tf-stripes"
                  width="6"
                  height="6"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="6" height="6" fill="#8B5CF61A" />
                  <rect x="0" y="0" width="2" height="6" fill="#8B5CF633" />
                </pattern>
                <linearGradient id="tf-line" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#978FED" />
                  <stop offset="100%" stopColor="#978FED" />
                </linearGradient>
              </defs>

              {/* Y labels (shifted slightly below the grid lines) */}
              {tickValues.map((tv, i) => {
                const y = M.top + yForValue(tv) + labelYOffset;
                return (
                  <text
                    key={i}
                    x={labelX}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="central"
                    fontSize="12"
                    fill="#0B0F1A"
                  >
                    {tv}
                  </text>
                );
              })}

              {/* Chart area (grid, area, line, markers) */}
              <g transform={`translate(${M.left}, ${M.top})`}>
                {/* Grid lines start after the labels (no lines under numbers) */}
                {[0.3, 0.5, 0.8].map((f, i) => {
                  const y = yForValue(yMax * f);
                  return (
                    <line
                      key={i}
                      x1={0}
                      x2={CW}
                      y1={y}
                      y2={y}
                      stroke="#E5E7EB"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Area (striped) */}
                <path d={area} fill="url(#tf-stripes)" stroke="none" />

                {/* Smooth line */}
                <path
                  d={line}
                  fill="none"
                  stroke="url(#tf-line)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Today vertical marker */}
                <line
                  x1={xToday}
                  x2={xToday}
                  y1={yToday}
                  y2={CH}
                  stroke="#978FED"
                  strokeOpacity="0.35"
                  strokeWidth="2"
                />

                {/* Today dot */}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}