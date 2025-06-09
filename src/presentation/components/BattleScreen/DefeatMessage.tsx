import React from 'react';
import './DefeatMessage.css';

interface DefeatMessageProps {
  onClose: () => void;
}

/**
 * 敗北メッセージコンポーネント
 */
export const DefeatMessage: React.FC<DefeatMessageProps> = ({ onClose }) => {
  return (
    <div className="defeat-overlay">
      <div className="defeat-content">
        <h2 className="defeat-title">負け</h2>
        <button className="defeat-close-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};