'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { useUserStore } from '@/store/userStore';
import { getWebSocket } from '@/components/globalSocket';
import PingPongGame from '@/components/PingPongGame';
import { useTranslation } from '@/contexts/LanguageContext';

import { ServerGameState } from '@/types/game';

export default function RemoteGameRoomPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { roomCode } = params;
  const { setGameMode } = useGameContext();
  const { socket } = useUserStore();

  const [serverGameState, setServerGameState] = useState<ServerGameState | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [error, setError] = useState('');
  const [rematchOffer, setRematchOffer] = useState(false);
  const [rematchDeclinedMessage, setRematchDeclinedMessage] = useState('');
  const [rematchRequested, setRematchRequested] = useState(false);
  const [gameOver, setGameOver] = useState<{winner: string; finalScore: any} | null>(null);

  useEffect(() => {
    document.title = t('game.onlineMultiplayerPingPong');
    setGameMode('remote');
  }, [setGameMode, t]);

  const handleAcceptRematch = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'rematch:accept' }));
      setRematchOffer(false);
    }
  }, [socket]);

  const handleDeclineRematch = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'rematch:decline' }));
      setRematchOffer(false);
    }
  }, [socket]);

  useEffect(() => {
    // Try to get WebSocket connection - first from store, then from globalSocket
    let activeSocket = socket;

    // If socket from store is not available, try to get it from globalSocket
    if (!activeSocket || activeSocket.readyState === WebSocket.CLOSED || activeSocket.readyState === WebSocket.CLOSING) {
      try {
        activeSocket = getWebSocket();
      } catch (err) {
        console.error('Failed to get WebSocket:', err);
      }
    }

    // Message handler function
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'gameState':
            setServerGameState(message.payload);
            break;
          case 'opponentLeft':
            setOpponentLeft(true);
            break;
          case 'rematch:offer':
            setRematchOffer(true);
            setRematchRequested(false); // Reset request status when offer received
            break;
          case 'rematch:declined':
            setRematchDeclinedMessage(t('game.opponentDeclinedRematch'));
            setRematchRequested(false); // Reset request status
            break;
          case 'rematch:start':
            setServerGameState(message.payload);
            setRematchOffer(false);
            setRematchDeclinedMessage('');
            setRematchRequested(false);
            setGameOver(null); // Reset game over state for rematch
            break;
          case 'gameOver':
            // Game ended, winner is in message.payload.winner
            setGameOver({
              winner: message.payload.winner,
              finalScore: message.payload.finalScore
            });
            // Update final game state if provided
            if (message.payload.finalGameState) {
              setServerGameState(message.payload.finalGameState);
            }
            break;
          case 'matchFound':
            // If we receive matchFound while on room page, update state
            if (message.payload.roomCode === roomCode) {
              setServerGameState(null); // Reset to trigger re-render
            }
            break;
          case 'error':
            setError(message.message || t('game.anErrorOccurred'));
            break;
          default:
            console.log('Unhandled game message:', message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // If still no socket, wait a bit for connection to establish, then redirect
    if (!activeSocket || (activeSocket.readyState !== WebSocket.OPEN && activeSocket.readyState !== WebSocket.CONNECTING)) {
      // Give it a short time to connect (in case it's still connecting)
      const timeoutId = setTimeout(() => {
        // Check one more time if socket is now available
        let finalSocket = socket;
        if (!finalSocket || finalSocket.readyState === WebSocket.CLOSED || finalSocket.readyState === WebSocket.CLOSING) {
          try {
            finalSocket = getWebSocket();
          } catch (err) {
            // If still no connection, redirect to game home page
            console.error('WebSocket connection not available, redirecting to game home');
            router.push('/game');
            return;
          }
        }

        // If socket is connecting, wait a bit more
        if (finalSocket && finalSocket.readyState === WebSocket.CONNECTING) {
          const connectTimeout = setTimeout(() => {
            if (finalSocket && finalSocket.readyState !== WebSocket.OPEN) {
              console.error('WebSocket connection timeout, redirecting to game home');
              router.push('/game');
            } else if (finalSocket && finalSocket.readyState === WebSocket.OPEN) {
              // Socket is now open, set up message handler
              finalSocket.addEventListener('message', handleMessage);
            }
          }, 2000); // Wait 2 more seconds for connection

          return () => clearTimeout(connectTimeout);
        }

        // If socket is still not open, redirect
        if (!finalSocket || finalSocket.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection not available, redirecting to game home');
          router.push('/game');
        } else {
          // Socket is open, set up message handler
          finalSocket.addEventListener('message', handleMessage);
        }
      }, 500); // Wait 500ms before checking

      return () => clearTimeout(timeoutId);
    }

    // If socket is connecting, wait for it to open
    if (activeSocket.readyState === WebSocket.CONNECTING) {
      const openHandler = () => {
        // Socket is now open, set up message handler
        activeSocket!.addEventListener('message', handleMessage);
      };

      activeSocket.addEventListener('open', openHandler);

      // Also set a timeout in case connection fails
      const connectTimeout = setTimeout(() => {
        if (activeSocket && activeSocket.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout, redirecting to game home');
          router.push('/game');
        }
      }, 3000);

      return () => {
        activeSocket?.removeEventListener('open', openHandler);
        activeSocket?.removeEventListener('message', handleMessage);
        clearTimeout(connectTimeout);
      };
    }

    // Socket is open, set up message handler
    activeSocket.addEventListener('message', handleMessage);

    return () => {
      activeSocket?.removeEventListener('message', handleMessage);
    };
  }, [socket, handleAcceptRematch, handleDeclineRematch, roomCode, router]);

  const leaveRoom = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'leaveRoom',
        payload: { roomCode }
      }));
    }
    router.push('/game');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <button
          onClick={() => router.push('/game')}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          {t('game.backToGameMenu')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('game.onlineGame')}</h2>
        <p className="text-gray-300">{t('game.room')}: {roomCode}</p>
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {t('game.leaveGame')}
          </button>
        </div>
      </div>
      {gameOver ? (
        <div className="text-white text-center p-8 bg-gray-800 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">{t('game.gameOver')}</h2>
          <p className="text-2xl mt-4 mb-6">{t('game.isTheWinner', { winner: gameOver.winner })}</p>
          <p className="text-lg mb-4">
            {t('game.finalScore')}: {gameOver.finalScore.player1} - {gameOver.finalScore.player2}
          </p>

          {rematchDeclinedMessage && <p className="text-red-400 mb-4">{rematchDeclinedMessage}</p>}

          {rematchOffer ? (
            <div>
              <p className="text-yellow-400 mb-4">{t('game.opponentRequestedRematch')}</p>
              <button
                onClick={handleAcceptRematch}
                className="mt-4 px-6 py-3 bg-yellow-500 rounded-lg text-lg hover:bg-yellow-600 transition-colors"
              >
                {t('game.acceptRematch')}
              </button>
              <button
                onClick={() => {
                  if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'rematch:decline' }));
                    setRematchOffer(false);
                  }
                }}
                className="mt-4 ml-4 px-6 py-3 bg-red-500 rounded-lg text-lg hover:bg-red-600 transition-colors"
              >
                {t('common.decline')}
              </button>
            </div>
          ) : rematchRequested ? (
            <p className="text-yellow-400 mb-4">{t('game.waitingForOpponentRematch')}</p>
          ) : (
            <button
              onClick={() => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(JSON.stringify({ type: 'rematch:request' }));
                  setRematchRequested(true);
                  setRematchDeclinedMessage(''); // Clear any previous decline message
                }
              }}
              className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg hover:bg-green-600 transition-colors"
            >
              {t('game.requestRematch')}
            </button>
          )}

          <button
            onClick={leaveRoom}
            className="mt-4 ml-4 px-6 py-3 bg-blue-500 rounded-lg text-lg hover:bg-blue-600 transition-colors"
          >
            {t('game.backToGameLobby')}
          </button>
        </div>
      ) : (
        <PingPongGame
          serverGameState={serverGameState}
          opponentLeft={opponentLeft}
          setServerGameState={setServerGameState}
          rematchDeclinedMessage={rematchDeclinedMessage}
          setRematchDeclinedMessage={setRematchDeclinedMessage}
          rematchOffer={rematchOffer}
          handleAcceptRematch={handleAcceptRematch}
        />
      )}
    </div>
  );
}
