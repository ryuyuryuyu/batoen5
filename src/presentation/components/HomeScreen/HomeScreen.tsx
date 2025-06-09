import React from 'react';
import { observer } from 'mobx-react-lite';
import type { GameViewModel } from '../../viewModels/GameViewModel';
import './HomeScreen.css';

interface HomeScreenProps {
  viewModel: GameViewModel;
}

/**
 * ホーム画面コンポーネント
 * ポケモン選択とゲーム開始を行う
 */
export const HomeScreen: React.FC<HomeScreenProps> = observer(({ viewModel }) => {
  const handlePokemonSelect = async (pokemonName: string) => {
    viewModel.selectPokemon(pokemonName);
    // ポケモンを選択したら即座にバトル画面に移行
    await viewModel.startBattle();
  };

  if (viewModel.loading) {
    return (
      <div className="home-screen">
        <div className="loading-container">
          <div className="pokeball-loader">
            <div className="pokeball">
              <div className="pokeball-top"></div>
              <div className="pokeball-bottom"></div>
              <div className="pokeball-center"></div>
            </div>
          </div>
          <div className="loading-text">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-screen">
      <div className="home-container">
        <div className="title-section">
          <h1 className="game-title">ポケモンバトエン</h1>
          <div className="title-decoration">
            <span className="star">⭐</span>
            <span className="pokeball-emoji">⚡</span>
            <span className="star">⭐</span>
          </div>
        </div>
        
        <div className="selection-section">
          <h2 className="selection-title">ポケモンを選んでね！</h2>
          
          <div className="pokemon-grid">
            {viewModel.availablePokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className="pokemon-card"
                onClick={() => handlePokemonSelect(pokemon.name)}
              >
                <div className="pokemon-card-inner">
                  <div className="pokemon-name">{pokemon.name}</div>
                  <div className="pokemon-types">
                    {pokemon.types.map((type, index) => (
                      <span key={index} className={`type-badge type-${type}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});