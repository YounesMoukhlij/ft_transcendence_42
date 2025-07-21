'use client';

import React, { useState, useRef } from 'react';
import { Player } from '../contexts/GameContext';

interface PlayerFormProps {
  player: Player;
  setPlayer: (player: Player) => void;
  title: string;
  isRequired?: boolean;
}

const avatarOptions = [
  '/user.png',
  '/profileface.png',
  '/robot.png',
  // Add more avatar options as needed
];

const colorOptions = [
  '#f87171', // red
  '#60a5fa', // blue
  '#fbbf24', // yellow
  '#34d399', // green
  '#a78bfa', // purple
  '#f3f4f6', // gray
];

const PlayerForm: React.FC<PlayerFormProps> = ({ player, setPlayer, title, isRequired = true }) => {
  const [nameError, setNameError] = useState('');
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (name: string) => {
    if (isRequired && name.trim().length === 0) {
      setNameError('Name is required');
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
    } else {
      setNameError('');
    }
    setPlayer({ ...player, name });
  };

  const handleAvatarChange = (avatar: string) => {
    setPlayer({ ...player, avatar });
  };

  const handleColorChange = (color: string) => {
    setPlayer({ ...player, color });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedAvatar(result);
        setPlayer({ ...player, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getCurrentAvatar = () => {
    return uploadedAvatar || player.avatar;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>

      {/* Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Name {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          value={player.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            nameError ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Enter player name"
          required={isRequired}
        />
        {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
      </div>

      {/* Avatar Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Avatar</label>

        {/* Upload Button */}
        <div className="mb-3">
          <button
            type="button"
            onClick={handleUploadClick}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            📁 Upload Image from Computer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-1">
            Supported formats: JPG, PNG, GIF (max 5MB)
          </p>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Uploaded image (if exists) */}
          {uploadedAvatar && (
            <button
              onClick={() => handleAvatarChange(uploadedAvatar)}
              className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                getCurrentAvatar() === uploadedAvatar
                  ? 'border-blue-500 scale-110'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              title="Uploaded image"
            >
              <img
                src={uploadedAvatar}
                alt="Uploaded avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          )}

          {/* Predefined avatars */}
          {avatarOptions.map((avatar, index) => (
            <button
              key={index}
              onClick={() => handleAvatarChange(avatar)}
              className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                getCurrentAvatar() === avatar
                  ? 'border-blue-500 scale-110'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <img
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
        <div className="grid grid-cols-6 gap-3">
          {colorOptions.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                player.color === color
                  ? 'border-blue-500 scale-110'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Player Preview */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Preview</h4>
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full border-2"
            style={{ borderColor: player.color }}
          >
            <img
              src={getCurrentAvatar() || '/user.png'}
              alt="Player avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="text-white font-medium">
            {player.name || 'Player Name'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;
