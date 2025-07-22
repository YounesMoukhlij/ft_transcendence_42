'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../../../components/GameContext';

const predefinedAvatars = [
  '/profileface.png',
  '/robot.png',
  '/user.png',
];

function Player2Setup() {
  const { gameState, setPlayers } = useGameContext();
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [upload, setUpload] = useState<File | null>(null);

  const handleAvatarSelect = (src: string) => {
    setAvatar(src);
    setUpload(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
        setUpload(e.target.files![0]);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlayers([
      gameState.players[0] || { name: 'Player 1', avatar: '', color: '#f87171' },
      { name: name || 'Player 2', avatar: avatar || '', color: '#60a5fa' },
    ]);
    router.push('/game/customize');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-transparent p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Player 2 Setup</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-white">Name</label>
          <input
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={16}
          />
          <label className="text-white mt-2">Choose an avatar</label>
          <div className="flex gap-4 mb-2">
            {predefinedAvatars.map(src => (
              <img
                key={src}
                src={src}
                alt="avatar"
                className={`w-16 h-16 items-center justify-center flex rounded-full border-2 cursor-pointer ${avatar === src ? 'border-blue-400' : 'border-gray-500'}`}
                onClick={() => handleAvatarSelect(src)}
              />
            ))}
            <label className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-700 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <span className="text-white text-xs">Upload</span>
            </label>
          </div>
          {avatar && (
            <div className="flex flex-col items-center">
              <span className="text-white text-xs mb-1">Preview:</span>
              <img src={avatar} alt="preview" className="w-16 h-16 rounded-full border-2 border-blue-400" />
            </div>
          )}
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!name && !avatar}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Player2Page() {
  return <Player2Setup />;
}
