"use client"
import { CardContent } from "./ui/card"
import { useRef, useEffect, useState } from "react"
import { useTranslation } from '@/contexts/LanguageContext';

interface PerformanceData {
  key: string
  wins: number
  losses: number
}

interface ChartProps {
  data: PerformanceData[]
}

export function IllustrationChart({ data }: ChartProps) {
  const [size, setSize] = useState({width: 0, height: 0});
  const ref = useRef<HTMLDivElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hover, setHover] = useState<string | null>(null);

  const {t} = useTranslation();


  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect;
      setSize({width, height});
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Initial bar growth animation
  useEffect(() => {
      const timer = setTimeout(() => {
      const startTime = Date.now();
      const animationDuration = 500;
      
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

  const width = size.width > 240 ? size.width : 240;
  const height = 300;
  const padding = 40;
  const barWidth = Math.round(width / 25);
  const maxValue = Math.max(...data.map(d => Math.max(d.wins, d.losses)));
  const xStep = (width - padding * 2) / data.length;
  
  const getX = (i: number) => padding + i * xStep;
  const getY = (v: number) =>
  {
    let operation = ( v / maxValue);
    if (isNaN(operation))
      operation = 0;
    return (height - padding - operation * (height - padding * 2));
  } 
  const getHeight = (v: number) =>
  {
    let operation = ( v / maxValue);
    if (isNaN(operation))
      operation = 0;
    return (operation * (height - padding * 2));
  } 
  
  // Animated height for bars
  const getAnimatedHeight = (v: number) => getHeight(v) * animationProgress;
  const getAnimatedY = (v: number) => getY(v) + getHeight(v) * (1 - animationProgress);

  // Generate Y-axis ticks (0 → maxValue, step = maxValue/4)
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((maxValue / 4) * i));

  return (
    <CardContent> 
      <div ref={ref} className="flex flex-col items-center p-4">
        <svg 
          width={width} 
          height={height} 
          className="bg-card/50 rounded-lg"
          style={{
            transition: 'width 0.5s ease'
          }}
        
        >
          {/* Grid lines + Y-axis  */}
          {ticks.map((t, i) => {
            const y = getY(t);
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#666"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-gray-400 text-xs"
                >
                  {t}
                </text>
              </g>
            );
          })}
          
          {/* X-axis */}
          {data.map((d, i) => (
            <text
              key={i}
              x={getX(i) + barWidth +  padding / 2}
              y={height - padding + 20}
              textAnchor="middle"
              className="fill-gray-400 text-xs"
            >
               {(() => {
            switch (d.key) {
              case 'Sun':
                return t('profile.sunday')
              case 'Mon':
                return  t('profile.monday')
              case 'Tue':
                return  t('profile.tuesday')
              case 'Wed':
                return  t('profile.wednesday')
              case 'Thu':
                  return t('profile.thursday')
              case 'Fri':
                  return t('profile.friday')
              case 'Sat':
                  return t('profile.saturday')
              default:
                return t('profile.sunday');
            }
          })()}
            </text>
          ))}
          
          {/* Animated Bars */}
          {data.map((d, i) => (
            <g key={i}>
              <rect
                key={`loss-${i}`}
                x={getX(i) + padding / 2}
                y={getAnimatedY(d.losses)}
                width={barWidth}
                height={getAnimatedHeight(d.losses)}
                fill="#ef4444"
                rx={2}
                className={hover != null && (hover != "loss" + i && hover != "lossall" ) ? "opacity-50 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300" }
                onMouseEnter={() => setHover("loss" + i)}
                onMouseLeave={() => setHover(null)}
              />
                <text className={hover == "loss" + i ? "fill-destructive stroke-destructive stroke-1" : "hidden"}
                key={i}
                x={getX(i) + padding / 2 + barWidth / 2}
                y={getY(d.losses) - 8}
                textAnchor="middle">
                {d.losses}
              </text>
              <>
              <rect
                key={`win-${i}`}
                x={getX(i) + barWidth + padding / 2}
                y={getAnimatedY(d.wins)}
                width={barWidth}
                height={getAnimatedHeight(d.wins)}
                fill="#3b82f6"
                className={hover != null && (hover != "win" + i && hover != "winall" )? "opacity-50 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300" }
                onMouseEnter={() => setHover("win" + i)}
                onMouseLeave={() => setHover(null)} 
                rx={2}
              />
              </>
              <>
              <text className={hover == "win" + i ? "fill-primary stroke-primary stroke-1" : "hidden"}
                key={i}
                x={getX(i) + barWidth + padding / 2 + barWidth / 2}
                y={getY(d.wins) - 8}
                textAnchor="middle">
                
                {d.wins}
              </text>
              </>
            </g>
          ))}
          
          {/* Axes */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#888"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#888"
          />
        </svg>
        
        {/* Legend */}
        <div className="flex gap-6 mt-2 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 inline-block rounded-sm cursor-pointer"
            onMouseEnter={() => setHover("lossall")}
            onMouseLeave={() => setHover(null)}></span>
            {t('profile.losses')}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-500 inline-block rounded-sm cursor-pointer"
            onMouseEnter={() => setHover("winall")}
            onMouseLeave={() => setHover(null)}
            ></span>
            {t('profile.wins')}
          </div>
        </div>
      </div>
    </CardContent>
  );
}

