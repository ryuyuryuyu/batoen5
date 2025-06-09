import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { GameViewModel } from './presentation/viewModels/GameViewModel';
import { BattlePokemonRepository } from './infrastructure/BattlePokemonRepository';
import { StatusConditionRepository } from './infrastructure/StatusConditionRepository';
import { HomeScreen } from './presentation/components/HomeScreen/HomeScreen';
import { BattleScreen } from './presentation/components/BattleScreen/BattleScreen';
import './App.css';

// ViewModelのインスタンスを作成（シングルトン）
const pokemonRepository = new BattlePokemonRepository();
const statusConditionRepository = new StatusConditionRepository();
const gameViewModel = new GameViewModel(pokemonRepository, statusConditionRepository);

/**
 * メインアプリケーションコンポーネント
 * ホーム画面とバトル画面の切り替えを管理
 */
const App: React.FC = observer(() => {
  useEffect(() => {
    // アプリケーション初期化
    gameViewModel.initialize();
  }, []);

  return (
    <div className="app">
      {gameViewModel.currentScreen === 'home' ? (
        <HomeScreen viewModel={gameViewModel} />
      ) : (
        <BattleScreen viewModel={gameViewModel} />
      )}
    </div>
  );
});

export default App;