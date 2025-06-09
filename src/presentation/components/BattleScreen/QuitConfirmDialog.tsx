import React from 'react';
import './QuitConfirmDialog.css';

interface QuitConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * やめる確認ダイアログコンポーネント
 */
export const QuitConfirmDialog: React.FC<QuitConfirmDialogProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3 className="dialog-title">ゲームをやめますか？</h3>
        <div className="dialog-buttons">
          <button className="dialog-button confirm" onClick={onConfirm}>
            やめる
          </button>
          <button className="dialog-button cancel" onClick={onCancel}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};