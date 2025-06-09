import React from 'react';
import { observer } from 'mobx-react-lite';
import type { BattlePokemon } from '../../../domain/models/BattlePokemon';
import type { StatusCondition } from '../../../domain/models/StatusCondition';
import { StatusConditionIcons } from './StatusConditionIcons';
import './PokemonCard.css';

interface PokemonCardProps {
  pokemon: BattlePokemon;
  imageUrl: string;
  statusConditions: StatusCondition[];
  onStatusConditionToggle: (statusConditionId: string) => void;
  onStatusConditionLongPress: (description: string) => void;
}

/**
 * ポケモンカードコンポーネント
 * ポケモンの基本情報を表示
 */
export const PokemonCard: React.FC<PokemonCardProps> = observer(({ 
  pokemon, 
  imageUrl, 
  statusConditions,
  onStatusConditionToggle,
  onStatusConditionLongPress
}) => {
  const primaryColor = pokemon.getPrimaryTypeColor();
  const secondaryColor = pokemon.getSecondaryTypeColor();

  // カードの背景スタイルを決定
  const cardStyle: React.CSSProperties = {
    background: secondaryColor 
      ? `linear-gradient(135deg, ${primaryColor} 50%, ${secondaryColor} 50%)`
      : primaryColor
  };

  // タイプバッジのスタイルを取得
  const getTypeBadgeStyle = (type: string) => {
    const typeColorMap: Record<string, { color: string; background: string }> = {
      'ノーマル': { color: '#000', background: '#A8A878' },
      'かくとう': { color: '#fff', background: '#C03028' },
      'ひこう': { color: '#000', background: '#A890F0' },
      'ほのお': { color: '#fff', background: '#F08030' },
      'くさ': { color: '#000', background: '#78C850' },
      'みず': { color: '#fff', background: '#6890F0' },
      'こおり': { color: '#000', background: '#98D8D8' },
      'どく': { color: '#fff', background: '#A040A0' },
      'ゴースト': { color: '#fff', background: '#705898' },
      'あく': { color: '#fff', background: '#705848' },
      'エスパー': { color: '#fff', background: '#F85888' },
      'フェアリー': { color: '#000', background: '#EE99AC' },
      'いわ': { color: '#fff', background: '#B8A038' },
      'じめん': { color: '#000', background: '#E0C068' },
      'でんき': { color: '#000', background: '#F8D030' },
      'ドラゴン': { color: '#fff', background: '#7038F8' },
      'はがね': { color: '#000', background: '#B8B8D0' },
      'むし': { color: '#fff', background: '#A8B820' },
    };
    return typeColorMap[type] || { color: '#fff', background: '#68A090' };
  };

  return (
    <div className="pokemon-card" style={cardStyle}>
      <div className="card-frame">
        <div className="card-header">
          <div className="pokemon-name-section">
            <span className="pokemon-symbol">{pokemon.symbol}</span>
            <span className="pokemon-name">{pokemon.name}</span>
          </div>
          <div className="pokemon-hp">
            HP：{pokemon.currentHp}/{pokemon.maxHp}
          </div>
        </div>

        <div className="card-body">
          <div className="pokemon-image-section">
            <div className="status-and-image">
              <StatusConditionIcons
                statusConditions={statusConditions}
                activeStatusConditions={pokemon.activeStatusConditions}
                onToggle={onStatusConditionToggle}
                onLongPress={onStatusConditionLongPress}
              />
              {imageUrl && (
                <div className="pokemon-image-container">
                  <img 
                    src={imageUrl} 
                    alt={pokemon.name}
                    className="pokemon-image"
                  />
                  <div className="image-glow"></div>
                </div>
              )}
            </div>
            <div className="pokemon-types">
              {pokemon.types.map((type, index) => {
                const style = getTypeBadgeStyle(type);
                return (
                  <span 
                    key={index} 
                    className="type-badge"
                    style={{ 
                      color: style.color, 
                      backgroundColor: style.background 
                    }}
                  >
                    {type}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card-decorations">
          <div className="corner-decoration top-left"></div>
          <div className="corner-decoration top-right"></div>
          <div className="corner-decoration bottom-left"></div>
          <div className="corner-decoration bottom-right"></div>
        </div>
      </div>
    </div>
  );
});