import React from 'react';
import './DiceButton.css';

interface DiceButtonProps {
  diceValue: number;
  isRolling: boolean;
  onRoll: () => void;
}

/**
 * サイコロボタンコンポーネント
 * サイコロの振り機能とアニメーション表示
 */
export const DiceButton: React.FC<DiceButtonProps> = ({ diceValue, isRolling, onRoll }) => {
  return (
    <button 
      className={`dice-button ${isRolling ? 'rolling' : ''}`}
      onClick={onRoll}
    >
      {diceValue === 0 ? (
        <span className="dice-icon">🎲</span>
      ) : (
        <span className="dice-value">{diceValue}</span>
      )}
      {isRolling && <div className="rolling-text">クリックで停止</div>}
    </button>
  );
};