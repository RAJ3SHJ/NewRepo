
import React from 'react';
import { PuzzlePiece } from '../types';

interface TileProps {
  piece: PuzzlePiece;
  size: number;
  gridSize: number;
  imageUri: string;
  onClick: () => void;
  isSolved: boolean;
}

const Tile: React.FC<TileProps> = ({ piece, size, gridSize, imageUri, onClick, isSolved }) => {
  const row = Math.floor(piece.currentIndex / gridSize);
  const col = piece.currentIndex % gridSize;
  
  // Calculate visual position
  const x = col * size;
  const y = row * size;

  if (piece.isBlank && !isSolved) return null;

  return (
    <div
      onClick={onClick}
      className={`absolute transition-all duration-300 ease-out cursor-pointer group`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${x}px, ${y}px)`,
        padding: '3px', // Increased gap slightly for a cleaner look
      }}
    >
      <div 
        className="w-full h-full relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow bg-gray-100"
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-500"
          style={{
            backgroundImage: `url(${imageUri})`,
            backgroundSize: `${gridSize * 100}%`,
            backgroundPosition: `${piece.imageOffset.x}% ${piece.imageOffset.y}%`,
          }}
        />
        {/* Subtle highlight on hover */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
      </div>
    </div>
  );
};

export default Tile;