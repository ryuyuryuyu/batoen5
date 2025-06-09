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
  
  // ホーム画面の状態
  availablePokemons: BattlePokemon[] = [];
  selectedPokemonName: string = '';
  loading = false;
  
  // バトル画面の状態
  currentPokemon: BattlePokemon | null = null;
  pokemonImageUrl: string = '';
  diceValue: number = 0;
  isDiceRolling = false;
  showQuitConfirm = false;
  showDefeatMessage = false;
  
  // 状態異常関連
  availableStatusConditions: StatusCondition[] = [];
  showStatusDescription = false;
  selectedStatusDescription = '';

  private pokemonRepository: IBattlePokemonRepository;
  private statusConditionRepository: IStatusConditionRepository;

  constructor(
    pokemonRepository: IBattlePokemonRepository,
    statusConditionRepository: IStatusConditionRepository
  ) {
    this.pokemonRepository = pokemonRepository;
    this.statusConditionRepository = statusConditionRepository;
    makeAutoObservable(this);
  }

  /**
   * アプリケーション初期化
   */
  async initialize(): Promise<void> {
    this.loading = true;
    try {
      // is_seedeがtrueのポケモンのみを取得
      this.availablePokemons = await this.pokemonRepository.getSeededPokemons();
      // 状態異常データを取得
      this.availableStatusConditions = await this.statusConditionRepository.getAll();
    } catch (error) {
      console.error('データの読み込みに失敗しました:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * ホーム画面でポケモンを選択
   * @param pokemonName 選択されたポケモン名
   */
  selectPokemon(pokemonName: string): void {
    this.selectedPokemonName = pokemonName;
  }

  /**
   * 選択されたポケモンでバトル画面に移行
   */
  async startBattle(): Promise<void> {
    if (!this.selectedPokemonName) {
      return;
    }

    this.loading = true;
    try {
      const pokemon = await this.pokemonRepository.getByName(this.selectedPokemonName);
      if (pokemon) {
        this.currentPokemon = pokemon;
        this.pokemonImageUrl = await this.pokemonRepository.getPokemonImageUrl(pokemon.url);
        this.currentScreen = 'battle';
        this.diceValue = 0;
        this.showDefeatMessage = false;
      }
    } catch (error) {
      console.error('バトル開始に失敗しました:', error);
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
    this.diceValue = 0;
    this.showQuitConfirm = false;
    this.showDefeatMessage = false;
    this.showStatusDescription = false;
  }

  /**
   * やめるボタンの確認ダイアログを表示
   */
  showQuitConfirmation(): void {
    this.showQuitConfirm = true;
  }

  /**
   * やめるボタンの確認ダイアログを非表示
   */
  hideQuitConfirmation(): void {
    this.showQuitConfirm = false;
  }

  /**
   * ダメージを与える
   * @param damage ダメージ量
   */
  dealDamage(damage: number): void {
    if (this.currentPokemon) {
      this.currentPokemon.takeDamage(damage);
      // MobXの反応性を確実にするためのスプレッド再代入は削除
      if (this.currentPokemon.isDefeated()) {
        this.showDefeatMessage = true;
      }
    }
  }

  /**
   * HP変更をundo
   */
  undoHpChange(): void {
    if (this.currentPokemon) {
      const success = this.currentPokemon.undoHpChange();
      if (success) {
        // MobXの反応性を確実にするためのスプレッド再代入は削除
        if (this.showDefeatMessage) {
          this.showDefeatMessage = false;
        }
      }
    }
  }

  /**
   * 状態異常をトグル
   * @param statusConditionId 状態異常のID
   */
  toggleStatusCondition(statusConditionId: string): void {
    if (this.currentPokemon) {
      this.currentPokemon.toggleStatusCondition(statusConditionId);
      // MobXの反応性を確実にするためのスプレッド再代入は削除
    }
  }

  /**
   * 状態異常の説明を表示
   * @param description 説明文
   */
  showStatusConditionDescription(description: string): void {
    this.selectedStatusDescription = description;
    this.showStatusDescription = true;
  }

  /**
   * 状態異常の説明を非表示
   */
  hideStatusConditionDescription(): void {
    this.showStatusDescription = false;
    this.selectedStatusDescription = '';
  }

  /**
   * サイコロを振る
   */
  rollDice(): void {
    if (this.isDiceRolling) {
      // サイコロを止める
      this.isDiceRolling = false;
    } else {
      // サイコロを開始
      this.isDiceRolling = true;
      this.startDiceAnimation();
    }
  }

  /**
   * サイコロのアニメーション開始
   */
  private startDiceAnimation(): void {
    const interval = setInterval(() => {
      if (!this.isDiceRolling) {
        clearInterval(interval);
        return;
      }
      this.diceValue = Math.floor(Math.random() * 6) + 1;
    }, 100);
  }

  /**
   * ポケモンを進化させる
   */
  async evolvePokemon(): Promise<void> {
    if (!this.currentPokemon || !this.currentPokemon.hasEvolution()) {
      return;
    }

    const evolutionName = this.currentPokemon.getEvolutionName();
    if (!evolutionName) {
      return;
    }

    try {
      const evolvedPokemon = await this.pokemonRepository.getByName(evolutionName);
      if (evolvedPokemon) {
        // HPの割合を維持して進化
        this.currentPokemon = this.currentPokemon.evolveWithHpRatio(evolvedPokemon);
        this.pokemonImageUrl = await this.pokemonRepository.getPokemonImageUrl(evolvedPokemon.url);
      }
    } catch (error) {
      console.error('進化に失敗しました:', error);
    }
  }

  /**
   * ポケモンを退化させる
   */
  async devolvePokemon(): Promise<void> {
    if (!this.currentPokemon || !this.currentPokemon.hasPreEvolution()) {
      return;
    }

    const preEvolutionName = this.currentPokemon.getPreEvolutionName();
    if (!preEvolutionName) {
      return;
    }

    try {
      const devolvedPokemon = await this.pokemonRepository.getByName(preEvolutionName);
      if (devolvedPokemon) {
        // HPの割合を維持して退化
        this.currentPokemon = this.currentPokemon.evolveWithHpRatio(devolvedPokemon);
        this.pokemonImageUrl = await this.pokemonRepository.getPokemonImageUrl(devolvedPokemon.url);
      }
    } catch (error) {
      console.error('退化に失敗しました:', error);
    }
  }

  /**
   * 敗北メッセージを非表示
   */
  hideDefeatMessage(): void {
    this.showDefeatMessage = false;
  }
}