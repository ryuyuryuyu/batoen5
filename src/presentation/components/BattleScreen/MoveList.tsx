import React from 'react';
import type { BattlePokemon } from '../../../domain/models/BattlePokemon';
import './MoveList.css';

interface MoveListProps {
  pokemon: BattlePokemon;
}

/**
 * 技リストコンポーネント
 * ポケモンの6つの技を表示
 */
export const MoveList: React.FC<MoveListProps> = ({ pokemon }) => {
  const moves = [1, 2, 3, 4, 5, 6].map(num => ({
    number: num,
    description: pokemon.getMove(num)
  }));

  return (
    <div className="move-list">
      {moves.map(move => (
        <div key={move.number} className="move-item">
          <span className="move-number">{move.number}</span>
          <div className="move-description">
            {move.description}
          </div>
        </div>
      ))}
    </div>
  );
};