
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Difficulty, Shape, PuzzlePiece, ThemeType } from '../types';
import { GRID_CONFIG, SHAPE_CLIPS, THEME_CONFIG } from '../constants';
import { generateSolvableShuffle, createPieces, areAdjacent } from '../services/puzzleLogic';
import Tile from './Tile';
import { Save, ArrowLeft, RotateCcw, HelpCircle, Trophy, Undo2 } from 'lucide-react';

interface GameViewProps {
  userName: string;
  initialState: GameState;
  theme: ThemeType;
  onSave: (state: GameState) => void;
  onFinish: (time: number) => void;
  onBack: () => void;
}

const GameView: React.FC<GameViewProps> = ({ userName, initialState, theme, onSave, onFinish, onBack }) => {
  const [state, setState] = useState<GameState>(initialState);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const themeColors = THEME_CONFIG[theme];

  // Effect to handle initialization and reset
  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  // Real-time timer effect
  useEffect(() => {
    if (state.isSolved || !state.startTime) {
      if (state.isSolved && state.endTime && state.startTime) {
        setElapsedTime(state.endTime - state.startTime);
      }
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - (state.startTime || Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isSolved, state.startTime, state.endTime]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    
    window.addEventListener('resize', updateSize);
    return () => {
        window.removeEventListener('resize', updateSize);
        observer.disconnect();
    };
  }, []);

  const tileSize = containerWidth / state.gridSize;

  const checkSolved = (pieces: PuzzlePiece[]) => {
    return pieces.every(p => p.id === -1 || p.id === p.currentIndex);
  };

  const handleTileClick = useCallback((piece: PuzzlePiece) => {
    if (state.isSolved || piece.isBlank) return;

    const blankPiece = state.pieces.find(p => p.isBlank)!;
    if (areAdjacent(piece.currentIndex, blankPiece.currentIndex, state.gridSize)) {
      const currentPiecesClone = [...state.pieces];
      
      const newPieces = state.pieces.map(p => {
        if (p.id === piece.id) return { ...p, currentIndex: blankPiece.currentIndex };
        if (p.id === blankPiece.id) return { ...p, currentIndex: piece.currentIndex };
        return p;
      });

      const solved = checkSolved(newPieces);
      const now = Date.now();
      const newState = {
        ...state,
        pieces: newPieces,
        moves: state.moves + 1,
        isSolved: solved,
        endTime: solved ? now : null,
        history: [...state.history, currentPiecesClone],
      };

      setState(newState);
      if (solved) {
        onFinish(now - (state.startTime || now));
      } else {
          onSave(newState);
      }
    }
  }, [state, onFinish, onSave]);

  const undoMove = useCallback(() => {
    if (state.isSolved || state.history.length === 0) return;

    const lastPieces = state.history[state.history.length - 1];
    const newHistory = state.history.slice(0, -1);

    const newState = {
      ...state,
      pieces: lastPieces,
      moves: state.moves - 1,
      history: newHistory,
    };

    setState(newState);
    onSave(newState);
  }, [state, onSave]);

  const resetGame = () => {
    const size = state.gridSize;
    const shuffled = generateSolvableShuffle(size);
    const newState = {
      ...state,
      pieces: createPieces(shuffled, size),
      moves: 0,
      startTime: Date.now(),
      endTime: null,
      isSolved: false,
      history: [],
    };
    setElapsedTime(0);
    setState(newState);
    onSave(newState);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4 animate-in fade-in duration-500">
      {/* Header matching image reference */}
      <div className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-[2.5rem] shadow-xl border border-white/50">
        <button 
          onClick={onBack} 
          className="p-4 bg-gray-50/50 text-gray-400 hover:bg-gray-100 rounded-3xl transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex gap-8 items-center flex-1 justify-center">
          <div className="text-center">
            <div className="text-[11px] opacity-40 font-black uppercase tracking-widest mb-1">Moves</div>
            <div className="text-2xl font-black text-sky-900 leading-none">{state.moves}</div>
          </div>
          
          <div className="text-center">
            <div className="text-[11px] opacity-40 font-black uppercase tracking-widest mb-1">Time</div>
            <div className="text-2xl font-black text-sky-900 leading-none tabular-nums">
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onMouseDown={() => setShowHint(true)} 
            onMouseUp={() => setShowHint(false)}
            onMouseLeave={() => setShowHint(false)}
            onTouchStart={() => setShowHint(true)}
            onTouchEnd={() => setShowHint(false)}
            className={`p-4 ${themeColors.accent} ${themeColors.text} rounded-[1.5rem] hover:brightness-95 transition-all shadow-sm active:scale-90`}
          >
            <HelpCircle size={22} />
          </button>
          <button 
            onClick={undoMove}
            disabled={state.history.length === 0 || state.isSolved}
            className={`p-4 rounded-[1.5rem] transition-all shadow-sm active:scale-90 ${state.history.length === 0 || state.isSolved ? 'bg-gray-50 text-gray-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            <Undo2 size={22} />
          </button>
          <button 
            onClick={resetGame}
            className="p-4 bg-gray-50 text-gray-400 rounded-[1.5rem] hover:bg-gray-100 transition-all shadow-sm active:scale-90"
          >
            <RotateCcw size={22} />
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center p-4">
          <div 
            className={`absolute inset-0 ${themeColors.accent} opacity-20 pointer-events-none rounded-[3rem] shadow-inner`}
          />
          
          <div 
            ref={containerRef}
            className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-white/30"
          >
            {state.pieces.map(piece => (
              <Tile 
                key={piece.id}
                piece={piece}
                size={tileSize}
                gridSize={state.gridSize}
                imageUri={state.imageUri}
                onClick={() => handleTileClick(piece)}
                isSolved={state.isSolved}
              />
            ))}

            {showHint && (
                <div 
                    className="absolute inset-0 pointer-events-none z-40 opacity-40 bg-cover bg-center transition-opacity duration-300"
                    style={{ backgroundImage: `url(${state.imageUri})` }}
                />
            )}

            {state.isSolved && (
                <div className={`absolute inset-0 z-50 flex items-center justify-center ${themeColors.button} text-white animate-in zoom-in duration-500`}>
                    <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center border-4 border-white/20">
                        <div className="bg-white text-current w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl" style={{ color: 'inherit' }}>
                            <Trophy size={32} />
                        </div>
                        <h2 className="text-3xl font-black mb-1 leading-tight tracking-tight">SOLVED!</h2>
                        <p className="text-white/80 mb-6 font-bold">{state.moves} moves • {formatTime(elapsedTime)}</p>
                        <button 
                            onClick={onBack}
                            className="bg-white text-gray-900 px-8 py-3 rounded-full font-black shadow-xl hover:scale-105 transition-all active:scale-95"
                        >
                            Menu
                        </button>
                    </div>
                </div>
            )}
          </div>
      </div>

      <div className="text-center">
          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 opacity-50`}>Square Boundary Puzzle</p>
          <p className="text-sm opacity-60 font-medium max-w-xs mx-auto italic">
              Slide tiles to complete the hidden image.
          </p>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className={`flex items-center gap-2 px-5 py-2 bg-white/40 backdrop-blur-xl border border-white/40 rounded-full text-[9px] font-black uppercase tracking-widest ${themeColors.text} shadow-sm`}>
            <Save size={10} className="opacity-40" /> Progress Auto-Saved
        </div>
      </div>
    </div>
  );
};

export default GameView;
