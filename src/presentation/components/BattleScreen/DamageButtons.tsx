import React from 'react';
import './DamageButtons.css';

interface DamageButtonsProps {
  onDamage: (damage: number) => void;
  onUndo: () => void;
}

/**
 * ダメージボタンコンポーネント
 * ダメージ量の選択とundo機能を提供
 */
export const DamageButtons: React.FC<DamageButtonsProps> = ({ onDamage, onUndo }) => {
  const damageValues = [30, 20, 10];

  return (
    <div className="damage-buttons">
      <div className="damage-grid">
        {damageValues.map(damage => (
          <button
            key={damage}
            className="damage-button"
            onClick={() => onDamage(damage)}
          >
            {damage}
          </button>
        ))}
      </div>
      <button className="undo-button" onClick={onUndo}>
        undo
      </button>
    </div>
  );
};