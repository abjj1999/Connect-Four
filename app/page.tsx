"use client";
import { useState } from "react";
// import 'tailwindcss/tailwind.css';

export default function Home() {
  // @ts-ignore
  const [grid, setGrid] = useState(Array(6).fill().map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<"red" | "yellow">("red");
  const [activeCell, setActiveCell] = useState<number | null>(null);
  function findEmptyCell(grid: string[][], column: number): number | null {
    for (let i = grid.length - 1; i >= 0; i--) {
      if (!grid[i][column]) {
        return i;
      }
    }

    return null;
  }

  const [winner, setWinner] = useState<string | null>(null);

  const handleClick = (col: number) => {
    const newGrid = [...grid];
    let row;
    for(let i = newGrid.length - 1; i >= 0; i--) {
      const rowArray = newGrid[i] as (string | null)[];
      if(rowArray[col] === null) {
        row = i;
        rowArray[col] = currentPlayer;
        break;
      }
    }
    
    if(row !== undefined) {
      const winner = checkWin(newGrid, row, col, currentPlayer);
      if(winner) {
        setWinner(winner);
      } else {
        setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
      }
      setGrid(newGrid);
    }
  };

// @ts-ignore
function checkWin(grid: (string | null)[][], row: number, col: number, player: string): string | null {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (let [dx, dy] of directions) {
      let i, j, count = 0;
      for (i = row, j = col; i >= 0 && i < grid.length && j >= 0 && j < grid[0].length && grid[i][j] === player; i += dx, j += dy) {
          count++;
      }
      for (i = row - dx, j = col - dy; i >= 0 && i < grid.length && j >= 0 && j < grid[0].length && grid[i][j] === player; i -= dx, j -= dy) {
          count++;
      }
      if (count >= 4) {
          return player;
      }
  }
  return null;
}

  function reset() {
    // Create a new grid with null values.
  const newGrid = Array(6).fill(null).map(() => Array(7).fill(null));

  // Reset the state.
  setGrid(newGrid);
  setCurrentPlayer('red');
  setWinner(null);
  }

  return (
    <div className="p-8 h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="">
        <div className="
        flex flex-row items-center justify-center
        ">
        <h1 className="text-4xl text-red-700 mb-8">Connect </h1>
        <h1 className="text-4xl text-gray-500 mb-8">-</h1>
        <h1 className="text-4xl text-yellow-500 mb-8"> Four</h1>

        </div>

        <div className="
          flex flex-row items-center justify-center
          mb-8
        ">

        <h2 className="
        text-2xl text-gray-500
        ">
          {winner ? 'Game Over' : `Current Player: `}&nbsp;
        </h2>

        <h2 className={`
        text-2xl
        ${winner ? 'text-gray-500' : currentPlayer === 'red' ? 'text-red-500' : 'text-yellow-500'}
        `}> 
        {winner ? 'Game Over' : ` ${currentPlayer.toUpperCase()}`}
        </h2>

        </div>


      </div>
  <div className="grid grid-cols-7 gap-2 mb-8">
    {grid.map((row, rowIndex) => (
      row.map((cell, colIndex) => (
        <div
  className={`w-12 h-12 transition-colors transition-transform duration-500 transform ${cell === 'red' ? 'bg-red-500' : cell === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'} ${activeCell === colIndex && 'scale-75'}`}
  onMouseDown={() => setActiveCell(colIndex)}
  onMouseUp={() => {
    setActiveCell(null);
    handleClick(colIndex);
  }}
  key={`${rowIndex}-${colIndex}`}
/>
      ))
    ))}
  </div>
  {winner && <h2 className={`text-4xl ${winner === 'red' ? 'text-red-500' : 'text-yellow-500'}`}>{winner.toUpperCase()} wins!</h2>}
  {winner && <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={reset}>Reset Game</button>}
</div>
  )
}
