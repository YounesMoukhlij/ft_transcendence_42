// hooks/useCountUp.ts
import { useEffect, useState } from 'react';

const useCountUp = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const startValue = 0;

  useEffect(() => {
    if (endValue === 0) return;

    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const newCount = Math.min(
        startValue + (progress / duration) * (endValue - startValue),
        endValue
      );
      setCount(Math.floor(newCount));

      if (progress < duration) {
        window.requestAnimationFrame(animateCount);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(animateCount);
    return () => {
      startTime = null;
    };
  }, [endValue, duration]);

  return count;
};


const formatDuration = (time : number) =>
{
  if (time === 0 || !time || time === undefined)
    return ("0s");
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  let duration : string = "";

  if (minutes != 0)
    duration += minutes + "m ";
  if (seconds != 0)
    duration += seconds + "s";

  return duration;
}

export {useCountUp, formatDuration};