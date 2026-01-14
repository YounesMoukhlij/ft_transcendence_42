"use client"

import { useState, useEffect, useRef } from "react"
import { CardContent } from "./ui/card"
import { useTranslation } from '@/contexts/LanguageContext';

interface PerformanceData {
  key: string
  wins: number
  losses: number
}

interface ChartProps {
  data: PerformanceData[]
}

export function IllustrationGraph({ data }: ChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({width: 0, height: 0});
  const [animationProgress, setAnimationProgress] = useState(0);  
  const winsPathRef = useRef<SVGPathElement>(null);
  const lossesPathRef = useRef<SVGPathElement>(null);
  const [winsPathLength, setWinsPathLength] = useState(0);
  const [lossesPathLength, setLossesPathLength] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [opacityHover, setOpacityHover] = useState<"win" | "loss" |  null>(null);
  
  const {t} = useTranslation();


  // Responsive observer --------------
  useEffect(() => {
      if (!ref.current) return;
      const observer = new ResizeObserver(([entry]) => {
        const {width, height} = entry.contentRect;
        setSize({width, height});
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);

  // Get path lengths for animation
  useEffect(() => {
    if (winsPathRef.current) {
      setWinsPathLength(winsPathRef.current.getTotalLength());
    }
    if (lossesPathRef.current) {
      setLossesPathLength(lossesPathRef.current.getTotalLength());
    }
  }, [size, data]);

  // ------------- Path animation   ---------------------
    useEffect(() => {
      const timer = setTimeout(() => { // set Timeout just for delaying the animation
        const startTime = Date.now();
        const animationDuration = 1500;
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          setAnimationProgress(progress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }, 200);
  
      return () => clearTimeout(timer);
    }, []);




     useEffect(() => {
    // Don't animate if there's no data yet
    if (!data || data.length === 0) {
      setAnimationProgress(0);
      return;
    }});

  
  const width : number = size.width > 235 ? size.width : 235;
  const height : number = 250
  const padding : number = 40

  const maxValue = Math.max(...(data?.map(d => Math.max(d.wins, d.losses)) || [0]));
  const xStep = (width - padding * 2) / data?.length || 0;

  // Scale helpers
  const getX = (i: number, key : string) => {

      let result = padding + i * xStep + padding;
    
      if (key == "wins")
      {
        return result -= 10;
      }
      if (isNaN(i) || isNaN(result))
      {
        return (0);
      }
      return  result;
  }  
  const getY = (v: number) => {
      let operation = ( v / maxValue);
      if (isNaN(operation))
        operation = 0;

      const result = height - padding - operation * (height - padding * 2);
      if (isNaN(v) || isNaN(result))
      {
        return 0;
      }
      return result;
  }

  // Line path generator
  const makePath = (key: "wins" | "losses") =>
    data?.map(
        (d, i) => `${i === 0 ? "M" : "L"} ${getX(i, key)},${getY(d[key])}`
      )
      .join(" ")

  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((maxValue / 4) * i));

  return (

    <CardContent > 
    <div ref={ref} className="flex flex-col items-center p-4">
      <svg
        width={width}
        height={height}
        className="bg-slate-900 rounded-xl shadow-md transition-all"
        style={{
            transition: 'width 0.5s ease'
        }}
      >
        {/* Grid lines */}
        {ticks.map((t, i) => {
          const y : number = getY(t) || 0;
          return (
              <g key={i}>
                 <>
                <line key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#475569"
                  strokeDasharray="3,3"
                  />
                  </>
                  <>
                  <text key={i}
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-gray-400 text-xs"
                  >{t}</text>
                  </>
              </g>
          )
        })}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#64748b"
          strokeWidth={1.5}
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#64748b"
          strokeWidth={1.5}
        />

        {/* Wins line with animation */}
        <path
          ref={winsPathRef}
          d={makePath("wins")}
          className={opacityHover != null && opacityHover != "win" ? "opacity-30 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300" }
          stroke="#10b981"
          strokeWidth={2.5}
          fill="none"
          strokeDasharray={winsPathLength}
          strokeDashoffset={winsPathLength * (1 - animationProgress)} // using the offset to hide the full length one dash, then removing the offset from 1 to 0
          onMouseEnter={() => setOpacityHover("win")}
          onMouseLeave={() => setOpacityHover(null)}
        />
        {data?.map((d, i) => (
          <circle
            key={i}
            cx={getX(i, "wins")}
            cy={getY(d.wins)}
            r={hover == "win" + i ? 6 : 4}
            fill="#10b981"
            stroke="#064e3b"
            strokeWidth={1}
            opacity={animationProgress > (i / (data.length - 1)) ? 1 : 0}
            style={{
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={() => setHover("win" + i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}

        {/* Losses line with animation */}
        <path
          ref={lossesPathRef}
          d={makePath("losses")}
          className={opacityHover != null && opacityHover != "loss" ? "opacity-30 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300" }
          stroke="#ef4444"
          strokeWidth={2.5}
          fill="none"
          strokeDasharray={lossesPathLength}
          strokeDashoffset={lossesPathLength * (1 - animationProgress)}
          onMouseEnter={() => setOpacityHover("loss")}
          onMouseLeave={() => setOpacityHover(null)}
        />
        {data?.map((d, i) => (
          <g key={i}>
          <circle
          key={i}
          cx={getX(i, "nan")}
          cy={getY(d.losses)}
          r={hover == "loss" + i ? 6 : 4}
          fill="#ef4444"
          stroke="#7f1d1d"
          strokeWidth={1}
          opacity={animationProgress > (i / (data.length - 1)) ? 1 : 0}
          style={{
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={() => setHover("loss" + i)}
          onMouseLeave={() => setHover(null)}
          />
          <>
         <text className={hover == "loss" + i ? "fill-destructive stroke-destructive stroke-1" : "hidden"}
                key={i}
                x={getX(i, "nan")}
                y={getY(d.losses) - 10}
                textAnchor="middle">
                
                {d.losses}
            </text>
            </>
              <>
             <text className={hover == "win" + i ? "fill-[#10b981] stroke-[#10b981] stroke-1" : "hidden"}
                key={i}
                x={getX(i, "wins")}
                y={getY(d.wins) - 10}
                textAnchor="middle">
                
                {d.wins}
              </text>
              </>
          </g>
        ))}

        {/* Labels */}
        {data?.map((d, i) => (
          <text
            key={i}
            x={getX(i, "nan")}
            y={height - padding + 18}
            textAnchor="middle"
            className="fill-gray-400 text-xs font-medium"
          >
            {d.key}
          </text>
        ))}
      </svg>
       <div className="flex gap-6 mt-2 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <span
              className="w-3 h-3 bg-red-500 inline-block rounded-sm cursor-pointer"
              onMouseEnter={() => setOpacityHover("loss")}
              onMouseLeave={() => setOpacityHover(null)}
             >
             </span>
            {t('profile.losses')}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 inline-block rounded-sm cursor-pointer"
              onMouseEnter={() => setOpacityHover("win")}
              onMouseLeave={() => setOpacityHover(null)}
            ></span>
             {t('profile.wins')}
          </div>
        </div>
      </div>
    </CardContent>
  )
}
