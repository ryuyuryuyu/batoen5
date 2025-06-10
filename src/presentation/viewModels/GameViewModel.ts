import { makeAutoObservable } from 'mobx';
import type { BattlePokemon } from '../../domain/models/BattlePokemon';
import type { StatusCondition } from '../../domain/models/StatusCondition';
import type { IBattlePokemonRepository } from '../../infrastructure/BattlePokemonRepository';
import type { IStatusConditionRepository } from '../../infrastructure/StatusConditionRepository';

/**
 * ゲーム全体の状態を管理するViewModel
 */
export class GameViewModel {
  // 画面状態
  currentScreen: 'home' | 'battle' = 'home';
  loading = false;

  // ポケモン関連
  availablePokemons: BattlePokemon[] = [];
  currentPokemon: BattlePokemon | null = null;
  selectedPokemonName = '';
  pokemonImageUrl = '';

  // 状態異常関連
  availableStatusConditions: StatusCondition[] = [];

  // UI状態
  showQuitConfirm = false;
  showDefeatMessage = false;
  showStatusDescription = false;
  selectedStatusDescription = '';

  // サイコロ関連
  diceValue = 0;
  isDiceRolling = false;
  private diceInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private pokemonRepository: IBattlePokemonRepository,
    private statusConditionRepository: IStatusConditionRepository
  ) {
    makeAutoObservable(this);
  }

  /**
   * アプリケーション初期化
   */
  async initialize(): Promise<void> {
    this.loading = true;
    try {
      // 利用可能なポケモンと状態異常を読み込み
      this.availablePokemons = await this.pokemonRepository.getSeededPokemons();
      this.availableStatusConditions = await this.statusConditionRepository.getAll();
    } catch (error) {
      console.error('初期化エラー:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * ポケモンを選択
   */
  selectPokemon(pokemonName: string): void {
    this.selectedPokemonName = pokemonName;
  }

  /**
   * バトル開始
   */
  async startBattle(): Promise<void> {
    if (!this.selectedPokemonName) return;

    try {
      this.loading = true;
      
      // 選択されたポケモンを取得
      const pokemon = await this.pokemonRepository.getByName(this.selectedPokemonName);
      if (!pokemon) {
        throw new Error('ポケモンが見つかりません');
      }

      this.currentPokemon = pokemon;
      
      // ポケモンの画像を取得
      this.pokemonImageUrl = await this.pokemonRepository.getPokemonImageUrl(pokemon.url);
      
      // バトル画面に移行
      this.currentScreen = 'battle';
    } catch (error) {
      console.error('バトル開始エラー:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * ホーム画面に戻る
   */
  goToHome(): void {
    this.currentScreen = 'home';
    this.currentPokemon = null;
    this.selectedPokemonName = '';
    this.pokemonImageUrl = '';
    this.hideQuitConfirmation();
    this.hideDefeatMessage();
    this.resetDice();
  }

  /**
   * ダメージを与える
   */
  dealDamage(damage: number): void {
    if (!this.currentPokemon) return;

    this.currentPokemon.takeDamage(damage);
    
    // 敗北判定
    if (this.currentPokemon.isDefeated()) {
      this.showDefeatMessage = true;
    }
  }

  /**
   * HPの変更を元に戻す
   */
  undoHpChange(): void {
    if (!this.currentPokemon) return;
    this.currentPokemon.undoHpChange();
  }

  /**
   * ポケモンを進化させる
   */
  async evolvePokemon(): Promise<void> {
    if (!this.currentPokemon || !this.currentPokemon.hasEvolution()) return;

    const evolutionName = this.currentPokemon.getEvolutionName();
    if (!evolutionName) return;

    try {
      const evolvedPokemon = await this.pokemonRepository.getByName(evolutionName);
      if (!evolvedPokemon) return;

      // HPを引き継いで新しいポケモンインスタンスを作成
      this.currentPokemon = this.currentPokemon.createWithInheritedHp(
        evolvedPokemon.id,
        evolvedPokemon.name,
        evolvedPokemon.url,
        evolvedPokemon.types,
        evolvedPokemon.maxHp,
        evolvedPokemon['_moveset'], // プライベートプロパティにアクセス
        evolvedPokemon['_evolutions'], // プライベートプロパティにアクセス
        evolvedPokemon.symbol
      );

      // 進化後のポケモンの画像を取得
      this.pokemonImageUrl = await this.pokemonRepository.getPokemonImageUrl(this.currentPokemon.url);
    } catch (error) {
      console.error('進化エラー:', error);
    }
  }

  /**
   * ポケモンを退化させる
   */
  async devolvePokemon(): Promise<void> {
    if (!this.currentPokemon || !this.currentPokemon.hasPreEvolution()) return;

    const preEvolutionName = this.currentPokemon.getPreEvolutionName();
    if (!preEvolutionName) return;

    try {
      const devolvedPokemon = await this.pokemonRepository.getByName(preEvolutionName);
      if (!devolvedPokemon) return;

      // HPを引き継いで新しいポケモンインスタンスを作成
      this.currentPokemon = this.currentPokemon.createWithInheritedHp(
        devolvedPokemon.id,
        devolvedPokemon.name,
        devolvedPokemon.url,
        devolvedPokemon.types,
        devolvedPokemon.maxHp,
        devolvedPokemon['_moveset'], // プライベートプロパティにアクセス
        devolvedPokemon['_evolutions'], // プライベートプロパティにアクセス
        devolvedPokemon.symbol
      );

      // 退化後のポケモンの画像を取得
      this.pokemonImageUrl = await this.pokemonRepository.getPokemonImageUrl(this.currentPokemon.url);
    } catch (error) {
      console.error('退化エラー:', error);
    }
  }

  /**
   * 状態異常の切り替え
   */
  toggleStatusCondition(statusConditionId: string): void {
    if (!this.currentPokemon) return;
    this.currentPokemon.toggleStatusCondition(statusConditionId);
  }

  /**
   * サイコロを振る
   */
  rollDice(): void {
    if (this.isDiceRolling) {
      // 振っている最中にクリックされたら停止
      this.stopDice();
    } else {
      // サイコロを振り始める
      this.startDice();
    }
  }

  /**
   * サイコロを振り始める
   */
  private startDice(): void {
    this.isDiceRolling = true;
    this.diceInterval = setInterval(() => {
      this.diceValue = Math.floor(Math.random() * 6) + 1;
    }, 100);
  }

  /**
   * サイコロを停止する
   */
  private stopDice(): void {
    if (this.diceInterval) {
      clearInterval(this.diceInterval);
      this.diceInterval = null;
    }
    this.isDiceRolling = false;
    // 最終的な値を設定
    this.diceValue = Math.floor(Math.random() * 6) + 1;
  }

  /**
   * サイコロをリセット
   */
  private resetDice(): void {
    if (this.diceInterval) {
      clearInterval(this.diceInterval);
      this.diceInterval = null;
    }
    this.isDiceRolling = false;
    this.diceValue = 0;
  }

  // UI状態管理メソッド
  showQuitConfirmation(): void {
    this.showQuitConfirm = true;
  }

  hideQuitConfirmation(): void {
    this.showQuitConfirm = false;
  }

  hideDefeatMessage(): void {
    this.showDefeatMessage = false;
  }

  showStatusConditionDescription(description: string): void {
    this.selectedStatusDescription = description;
    this.showStatusDescription = true;
  }

  hideStatusConditionDescription(): void {
    this.showStatusDescription = false;
    this.selectedStatusDescription = '';
  }
}