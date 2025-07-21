'use client';

import React from 'react';
import { GiPingPongBat } from 'react-icons/gi';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = '#FFFFFF',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  const iconSizes = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`loader ${sizeClasses[size]}`}>
        <div className="box">
          <div className="logo">
            <GiPingPongBat className={`${iconSizes[size]} text-white`} />
          </div>
        </div>
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
      </div>
    </div>
  );
};

export default Loading;
