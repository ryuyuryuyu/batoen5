import React from 'react';
import './StatusDescriptionModal.css';

interface StatusDescriptionModalProps {
  description: string;
  onClose: () => void;
}

/**
 * 状態異常説明モーダルコンポーネント
 */
export const StatusDescriptionModal: React.FC<StatusDescriptionModalProps> = ({
  description,
  onClose
}) => {
  return (
    <div className="status-description-overlay\" onClick={onClose}>
      <div className="status-description-content" onClick={(e) => e.stopPropagation()}>
        <p className="status-description-text">{description}</p>
      </div>
    </div>
  );
};