import React from 'react';
import { observer } from 'mobx-react-lite';
import type { GameViewModel } from '../../viewModels/GameViewModel';
import { PokemonCard } from './PokemonCard';
import { MoveList } from './MoveList';
import { DamageButtons } from './DamageButtons';
import { DiceButton } from './DiceButton';
import { QuitConfirmDialog } from './QuitConfirmDialog';
import { DefeatMessage } from './DefeatMessage';
import { StatusDescriptionModal } from './StatusDescriptionModal';
import './BattleScreen.css';

interface BattleScreenProps {
  viewModel: GameViewModel;
}

/**
 * バトル画面コンポーネント
 * ポケモンバトルのメイン画面
 */
export const BattleScreen: React.FC<BattleScreenProps> = observer(({ viewModel }) => {
  if (!viewModel.currentPokemon) {
    return <div>ポケモンが選択されていません</div>;
  }

  const pokemon = viewModel.currentPokemon;

  return (
    <div className="battle-screen">
      <div className="battle-container">
        {/* ポケモンカード */}
        <PokemonCard 
          pokemon={pokemon}
          imageUrl={viewModel.pokemonImageUrl}
          statusConditions={viewModel.availableStatusConditions}
          onStatusConditionToggle={(id) => viewModel.toggleStatusCondition(id)}
          onStatusConditionLongPress={(description) => viewModel.showStatusConditionDescription(description)}
        />

        {/* 操作ボタン群 */}
        <div className="battle-controls">
          {/* 上部ボタン */}
          <div className="top-buttons">
            <button 
              className="quit-button"
              onClick={() => viewModel.showQuitConfirmation()}
            >
              やめる
            </button>
            
            {pokemon.hasPreEvolution() && (
              <button 
                className="devolve-button"
                onClick={() => viewModel.devolvePokemon()}
              >
                進化前
              </button>
            )}
            
            {pokemon.hasEvolution() && (
              <button 
                className="evolve-button"
                onClick={() => viewModel.evolvePokemon()}
              >
                進化
              </button>
            )}
          </div>

          {/* 技リスト */}
          <MoveList pokemon={pokemon} />

          {/* ダメージボタン */}
          <DamageButtons 
            onDamage={(damage) => viewModel.dealDamage(damage)}
            onUndo={() => viewModel.undoHpChange()}
          />

          {/* サイコロボタン */}
          <DiceButton 
            diceValue={viewModel.diceValue}
            isRolling={viewModel.isDiceRolling}
            onRoll={() => viewModel.rollDice()}
          />
        </div>

        {/* 確認ダイアログ */}
        {viewModel.showQuitConfirm && (
          <QuitConfirmDialog 
            onConfirm={() => viewModel.goToHome()}
            onCancel={() => viewModel.hideQuitConfirmation()}
          />
        )}

        {/* 敗北メッセージ */}
        {viewModel.showDefeatMessage && (
          <DefeatMessage 
            onClose={() => viewModel.hideDefeatMessage()}
          />
        )}

        {/* 状態異常説明モーダル */}
        {viewModel.showStatusDescription && (
          <StatusDescriptionModal
            description={viewModel.selectedStatusDescription}
            onClose={() => viewModel.hideStatusConditionDescription()}
          />
        )}
      </div>
    </div>
  );
});