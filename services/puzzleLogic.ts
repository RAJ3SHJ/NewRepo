
import { PuzzlePiece, Difficulty } from '../types';
import { GRID_CONFIG } from '../constants';

/**
 * Calculates the number of inversions in the array.
 * An inversion is when a higher numbered tile precedes a lower numbered tile.
 */
function getInversionCount(arr: number[]): number {
  let inversions = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] !== -1 && arr[j] !== -1 && arr[i] > arr[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

/**
 * Checks if a puzzle configuration is solvable.
 */
export function isSolvable(indices: number[], size: number): boolean {
  const inversions = getInversionCount(indices);
  const blankIndex = indices.indexOf(-1);
  const blankRowFromBottom = size - Math.floor(blankIndex / size);

  if (size % 2 !== 0) {
    // For odd size, solvable if inversions is even
    return inversions % 2 === 0;
  } else {
    // For even size:
    // Solvable if (blank row from bottom is odd and inversions is even)
    // OR (blank row from bottom is even and inversions is odd)
    if (blankRowFromBottom % 2 !== 0) {
      return inversions % 2 === 0;
    } else {
      return inversions % 2 !== 0;
    }
  }
}

/**
 * Shuffles tiles until a solvable state is reached.
 */
export function generateSolvableShuffle(size: number): number[] {
  const total = size * size;
  let indices: number[];
  
  do {
    indices = Array.from({ length: total - 1 }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Add the blank tile (-1) at the end
    indices.push(-1);
  } while (!isSolvable(indices, size));

  return indices;
}

/**
 * Checks if two indices are adjacent in the grid.
 */
export function areAdjacent(idx1: number, idx2: number, size: number): boolean {
  const r1 = Math.floor(idx1 / size);
  const c1 = idx1 % size;
  const r2 = Math.floor(idx2 / size);
  const c2 = idx2 % size;

  return (Math.abs(r1 - r2) === 1 && c1 === c2) || 
         (Math.abs(c1 - c2) === 1 && r1 === r2);
}

/**
 * Creates initial piece objects from shuffled indices.
 */
export function createPieces(shuffledIndices: number[], size: number): PuzzlePiece[] {
  return shuffledIndices.map((id, index) => {
    const isBlank = id === -1;
    // The image offset is based on the ORIGINAL position of the piece (id)
    // If blank, it doesn't really matter, but let's point it to the last cell
    const targetId = isBlank ? size * size - 1 : id;
    const r = Math.floor(targetId / size);
    const c = targetId % size;
    
    return {
      id,
      currentIndex: index,
      imageOffset: {
        x: (c / size) * 100,
        y: (r / size) * 100,
      },
      isBlank,
    };
  });
}
