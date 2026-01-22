'use client';

import React from 'react';
import Image from 'next/image';
import { TournamentMatch } from './GameContext';
import { FaTrophy, FaGamepad, FaCheck, FaClock } from 'react-icons/fa';
import { useTranslation } from '@/contexts/LanguageContext';
import {getProfileImageUrl} from '@/lib/utils'

interface LocalTournamentBracketProps {
  bracket: TournamentMatch[];
  currentMatchIndex: number;
  onStartMatch: () => void;
  onBack: () => void;
}

export default function LocalTournamentBracket({
  bracket,
  currentMatchIndex,
  onStartMatch,
  onBack,
}: LocalTournamentBracketProps) {
  const { t } = useTranslation();
  const currentMatch = bracket[currentMatchIndex];

  const getRoundName = (round: number, totalRounds: number) => {
    if (totalRounds === 2) {
      return round === 1 ? t('game.semiFinal') : t('game.final');
    } else if (totalRounds === 3) {
      if (round === 1) return t('game.quarterFinal');
      if (round === 2) return t('game.semiFinal');
      return t('game.final');
    }
    return `${t('game.round')} ${round}`;
  };

  const totalRounds = Math.max(...bracket.map(m => m.round));
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  const getMatchStatusIcon = (match: TournamentMatch) => {
    if (match.status === 'finished') {
      return <FaCheck className="text-green-400" />;
    }
    if (match.status === 'playing') {
      return <FaGamepad className="text-blue-400 animate-pulse" />;
    }
    if (match.status === 'pending' && match.player1 && match.player2) {
      return <FaGamepad className="text-yellow-400" />;
    }
    return <FaClock className="text-gray-400" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto rounded-3xl shadow-2xl border-2 border-gray-800 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white bg-clip-text">
          {t('game.tournamentBracket')}
        </h1>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all cursor-pointer"
        >
          {t('common.back')}
        </button>
      </div>

      {/* Bracket Visualization */}
      <div className="flex justify-around items-start gap-8 flex-wrap">
        {rounds.map((round) => {
          const roundMatches = bracket.filter(m => m.round === round);

          return (
            <div key={round} className="flex-1 min-w-[280px]">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold  mb-2">
                  {getRoundName(round, totalRounds)}
                </h2>
              </div>

              <div className="space-y-4">
                {roundMatches.map((match) => {
                  const isCurrentMatch = match.id === currentMatch?.id;
                  const isReady = match.status === 'pending' && match.player1 && match.player2 && !match.winner;
                  const isFinished = match.status === 'finished';

                  return (
                    <div
                      key={match.id}
                      className={`bg-[#1a1f2e]/40 rounded-xl p-4 border transition-all duration-300 ${
                        isCurrentMatch
                          ? 'border-blue-500 shadow-lg shadow-blue-500/50 scale-105'
                          : isFinished
                          ? 'border-green-500'
                          : 'border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">
                          {t('game.match')} {match.id}
                        </span>
                        {getMatchStatusIcon(match)}
                      </div>

                      {/* Player 1 */}
                      <div
                        className={`mb-2 p-3 rounded-lg transition-all ${
                          match.winner?.id === match.player1?.id
                            ? 'bg-[#1a1f2e]/60 border border-yellow-100/20'
                            : isFinished && match.winner?.id !== match.player1?.id
                            ? 'bg-[#1a1f2e]/60 opacity-50'
                            : 'bg-[#1a1f2e]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={getProfileImageUrl(match.player1?.avatar) || '/default-avatar.png'}
                            alt={match.player1?.name || t('game.player1')}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full border-2 border-blue-400"
                            unoptimized
                          />
                          <span className="text-white font-semibold flex-1">
                            {match.player1?.name || t('game.waiting')}
                          </span>
                          {match.winner?.id === match.player1?.id && (
                            <FaTrophy className="text-yellow-400" />
                          )}
                        </div>
                      </div>

                      {/* VS */}
                      <div className="text-center text-gray-400 text-sm my-2">{t('game.VS')}</div>

                      {/* Player 2 */}
                      <div
                        className={`p-3 rounded-lg transition-all ${
                          match.winner?.id === match.player2?.id
                            ? 'bg-[#1a1f2e]/50 border border-yellow-100/20'
                            : isFinished && match.winner?.id !== match.player2?.id
                            ? 'bg-[#1a1f2e]/50 opacity-50'
                            : 'bg-[#1a1f2e]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={getProfileImageUrl(match.player2?.avatar) || '/default-avatar.png'}
                            alt={match.player2?.name || t('game.player2')}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full border-2 border-blue-400"
                            unoptimized
                          />
                          <span className="text-white font-semibold flex-1">
                            {match.player2?.name || t('game.waiting')}
                          </span>
                          {match.winner?.id === match.player2?.id && (
                            <FaTrophy className="text-yellow-400" />
                          )}
                        </div>
                      </div>

                      {/* Start Match Button */}
                      {isCurrentMatch && isReady && !isFinished && (
                        <button
                          onClick={onStartMatch}
                          className="w-full mt-4 px-4 py-3 bg-blue-500/50 text-white rounded-lg font-semibold transition-all transform hover:scale-101 flex items-center cursor-pointer justify-center gap-2"
                        >
                          <FaGamepad />
                          {t('game.startMatch')}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Match Highlight */}
      {currentMatch && (
        <div className="mt-8 text-center">
          <div className="inline-block bg-blue-200 bg-opacity-50 rounded-xl p-4 border border-gray-800">
            <p className="text-blue-300 text-lg font-semibold">
              {t('game.currentMatch')}: {getRoundName(currentMatch.round, totalRounds)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

