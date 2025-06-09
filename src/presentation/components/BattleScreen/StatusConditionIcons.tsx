import React from 'react';
import { observer } from 'mobx-react-lite';
import type { StatusCondition } from '../../../domain/models/StatusCondition';
import './StatusConditionIcons.css';

interface StatusConditionIconsProps {
  statusConditions: StatusCondition[];
  activeStatusConditions: string[];
  onToggle: (statusConditionId: string) => void;
  onLongPress: (description: string) => void;
}

/**
 * 状態異常アイコンコンポーネント
 */
export const StatusConditionIcons: React.FC<StatusConditionIconsProps> = observer(({
  statusConditions,
  activeStatusConditions,
  onToggle,
  onLongPress
}) => {
  const handleLongPress = (description: string) => {
    let pressTimer: ReturnType<typeof setTimeout>;
    
    const startPress = () => {
      pressTimer = setTimeout(() => {
        onLongPress(description);
      }, 500); // 500ms長押し
    };

    const endPress = () => {
      clearTimeout(pressTimer);
    };

    return { startPress, endPress };
  };

  return (
    <div className="status-condition-icons">
      {statusConditions.map((condition) => {
        const isActive = activeStatusConditions.includes(condition.id);
        const { startPress, endPress } = handleLongPress(condition.description);
        
        return (
          <div
            key={condition.id}
            className={`status-icon ${isActive ? 'active' : 'inactive'}`}
            style={{
              backgroundColor: condition.backgroundColor,
              color: condition.textColor,
              borderColor: condition.textColor,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle(condition.id);
            }}
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            title={condition.name}
          >
            {condition.name.charAt(0)}
          </div>
        );
      })}
    </div>
  );
});