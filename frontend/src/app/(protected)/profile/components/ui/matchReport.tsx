// components/MatchStats.tsx

import { useCountUp } from "../../hooks/useCountUp";

interface MatchStatsProps {
  duration: string;
  longestRally: number
  avgRally: number;
  maxSpeed: number;
}

export function MatchStats({duration, longestRally, maxSpeed, avgRally} : MatchStatsProps) {
    const _longestRally = useCountUp(longestRally, 850);
    const _maxSpeed = useCountUp(maxSpeed, 850);;

  return (
    <div className="flex justify-center items-center mt-4  p-4 bg-background">
      <div className="w-full max-w-lg rounded-3xl  bg-background shadow-lg ">
        {/* <h2 className="text-white text-2xl font-bold tracking-wider mb-6 uppercase text-center">
          Match Report
        </h2> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Longest Rally Card */}
          <div className="border rounded-2xl p-6 text-center relative overflow-hidden">
            <p className="text-6xl text-primary font-extrabold leading-none">
             {_longestRally}
            </p>
            <p className="text-gray-300 font-light text-sm mt-1">
              Longest Rally
            </p>
            {/* Waveform SVG */}
           
          </div>

          {/* Ball Max Speed Card */}
          <div className=" border rounded-2xl p-6 text-center relative overflow-hidden">
            <p className="text-6xl text-primary font-extrabold leading-none">
              {_maxSpeed}
              <span className="text-xl font-normal ml-1">km/h</span>
            </p>
            <p className="text-gray-300 font-light text-sm mt-1">
              Ball Max Speed
            </p>
            {/* Speedometer SVG */}
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="border border-gray-700 rounded-xl px-6 py-4 text-center shadow-md">
            <p className="text-lg font-semibold">{duration}</p>
            <p className="text-xs text-gray-400">Duration</p>
          </div>
          <div className=" border border-gray-700 rounded-xl px-6 py-4 text-center shadow-md">
            <p className="text-lg font-semibold">{avgRally}</p>
            <p className="text-xs text-gray-400">Average Rally</p>
          </div>
        </div>
      </div>
    </div>
  );
};
