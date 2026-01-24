// components/MatchStats.tsx

import { useCountUp } from "../../hooks/useCountUp";
import { useTranslation } from '@/contexts/LanguageContext';


interface MatchStatsProps {
  duration: string;
  totalTouches: number;
  pointsPerSecond: number;
  maxSpeed: number;
}

export function MatchStats({duration, totalTouches, pointsPerSecond, maxSpeed} : MatchStatsProps) {
    const _totalTouches = useCountUp(totalTouches, 850);
    const _maxSpeed = useCountUp(maxSpeed, 850);
    const {t} = useTranslation();

  return (
    <div className="flex justify-center items-center mt-4  p-4 bg-background">
      <div className="w-full max-w-lg rounded-3xl  bg-background shadow-lg ">
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="border border-gray-700/50 rounded-2xl p-6 text-center relative overflow-hidden">
            <p className="text-6xl text-primary font-extrabold leading-none">
             {_totalTouches}
            </p>
            <p className="text-gray-300 font-light text-sm mt-1">
              {t('profile.totalTouches')}
            </p>
           
          </div>

          <div className="border border-gray-700/50 rounded-2xl p-6 text-center relative overflow-hidden">
            <p className="text-6xl text-primary font-extrabold leading-none">
              {_maxSpeed || 0} 
              <span className="text-xl font-normal ml-1">km/h</span>
            </p>
            <p className="text-gray-300 font-light text-sm mt-1">
              {t('profile.ballMaxSpeed')}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="border border-gray-700/50 rounded-xl px-6 py-4 text-center shadow-md">
            <p className="text-lg font-semibold">{duration}</p>
            <p className="text-xs text-gray-400">{t('profile.duration')}</p>
          </div>
          <div className=" border border-gray-700/50 rounded-xl px-6 py-4 text-center shadow-md">
            <p className="text-lg font-semibold">{pointsPerSecond}</p>
            <p className="text-xs text-gray-400">{t('profile.secondsPerPoint')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
