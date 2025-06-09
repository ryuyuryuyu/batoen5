import { makeAutoObservable, observable } from "mobx";

/**
 * バトル用ポケモンのタイプ定義
 */
export interface PokemonType {
  name: string;
}

/**
 * ポケモンの技セット
 */
export interface Moveset {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  "6": string;
}

/**
 * ポケモンの進化情報
 */
export interface Evolution {
  before?: string;
  after?: string;
}

/**
 * バトル用ポケモンエンティティ
 * バトル鉛筆ゲームで使用するポケモンの情報を管理
 */
export class BattlePokemon {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _url: string;
  private readonly _types: string[];
  private readonly _maxHp: number;
  private _currentHp: number;
  private readonly _moveset: Moveset;
  private readonly _evolutions: Evolution[];
  private readonly _isSeede: boolean;
  private _hpHistory: number[] = []; // HP変更履歴（undo機能用）
  private _symbol: '●' | '★'; // ランダムで決まるシンボル
  private _activeStatusConditions = observable.array<string>([]); // observableな配列に修正

  constructor(
    id: number,
    name: string,
    url: string,
    types: string[],
    maxHp: number,
    moveset: Moveset,
    evolutions: Evolution[],
    isSeede: boolean
  ) {
    this._id = id;
    this._name = name;
    this._url = url;
    this._types = types;
    this._maxHp = maxHp;
    this._currentHp = maxHp;
    this._moveset = moveset;
    this._evolutions = evolutions;
    this._isSeede = isSeede;
    this._hpHistory.push(maxHp);
    // ランダムでシンボルを決定
    this._symbol = Math.random() < 0.5 ? '●' : '★';
    makeAutoObservable(this);
  }

  // ゲッター
  get id(): number { return this._id; }
  get name(): string { return this._name; }
  get url(): string { return this._url; }
  get types(): string[] { return [...this._types]; }
  get maxHp(): number { return this._maxHp; }
  get currentHp(): number { return this._currentHp; }
  get moveset(): Moveset { return { ...this._moveset }; }
  get evolutions(): Evolution[] { return [...this._evolutions]; }
  get isSeede(): boolean { return this._isSeede; }
  get symbol(): '●' | '★' { return this._symbol; }
  get activeStatusConditions(): string[] {
    return this._activeStatusConditions;
  }

  /**
   * ダメージを受ける
   * @param damage ダメージ量
   */
  takeDamage(damage: number): void {
    this._hpHistory.push(this._currentHp);
    this._currentHp = Math.max(0, this._currentHp - damage);
  }

  /**
   * HP変更を元に戻す（undo機能）
   */
  undoHpChange(): boolean {
    if (this._hpHistory.length > 1) {
      this._hpHistory.pop(); // 現在のHPを削除
      this._currentHp = this._hpHistory[this._hpHistory.length - 1];
      return true;
    }
    return false;
  }

  /**
   * 状態異常を追加/削除する
   * @param statusConditionId 状態異常のID
   */
  toggleStatusCondition(statusConditionId: string): void {
    const idx = this._activeStatusConditions.indexOf(statusConditionId);
    if (idx >= 0) {
      this._activeStatusConditions.splice(idx, 1);
    } else {
      this._activeStatusConditions.push(statusConditionId);
    }
  }

  /**
   * 指定した状態異常がアクティブかチェック
   * @param statusConditionId 状態異常のID
   */
  hasStatusCondition(statusConditionId: string): boolean {
    return this._activeStatusConditions.includes(statusConditionId);
  }

  /**
   * ポケモンが倒れているかチェック
   */
  isDefeated(): boolean {
    return this._currentHp <= 0;
  }

  /**
   * 進化先があるかチェック
   */
  hasEvolution(): boolean {
    return this._evolutions.some(evo => evo.after);
  }

  /**
   * 進化前があるかチェック
   */
  hasPreEvolution(): boolean {
    return this._evolutions.some(evo => evo.before);
  }

  /**
   * 進化先の名前を取得
   */
  getEvolutionName(): string | null {
    const evolution = this._evolutions.find(evo => evo.after);
    return evolution?.after || null;
  }

  /**
   * 進化前の名前を取得
   */
  getPreEvolutionName(): string | null {
    const evolution = this._evolutions.find(evo => evo.before);
    return evolution?.before || null;
  }

  /**
   * HPの割合を維持して進化/退化
   * @param newPokemon 新しいポケモン
   */
  evolveWithHpRatio(newPokemon: BattlePokemon): BattlePokemon {
    const hpRatio = this._currentHp / this._maxHp;
    const newCurrentHp = Math.floor(newPokemon.maxHp * hpRatio);
    
    // 新しいポケモンのHPを調整
    newPokemon._currentHp = newCurrentHp;
    newPokemon._hpHistory = [...this._hpHistory];
    // 状態異常も引き継ぐ
    newPokemon._activeStatusConditions.replace(this._activeStatusConditions);
    
    return newPokemon;
  }

  /**
   * 指定した番号の技を取得
   * @param moveNumber 技番号（1-6）
   */
  getMove(moveNumber: number): string {
    const moveKey = moveNumber.toString() as keyof Moveset;
    return this._moveset[moveKey] || '';
  }

  /**
   * メインタイプの色を取得
   */
  getPrimaryTypeColor(): string {
    return this.getTypeColor(this._types[0]);
  }

  /**
   * サブタイプの色を取得（存在する場合）
   */
  getSecondaryTypeColor(): string | null {
    return this._types[1] ? this.getTypeColor(this._types[1]) : null;
  }

  /**
   * タイプに対応する色を取得
   */
  private getTypeColor(type: string): string {
    const typeColors: Record<string, string> = {
      'ノーマル': '#A8A878',
      'かくとう': '#C03028',
      'ひこう': '#00bfff',
      'どく': '#A040A0',
      'じめん': '#E0C068',
      'いわ': '#B8A038',
      'むし': '#A8B820',
      'ゴースト': '#705898',
      'はがね': '#B8B8D0',
      'ほのお': '#F08030',
      'みず': '#6890F0',
      'くさ': '#78C850',
      'でんき': '#F8D030',
      'エスパー': '#F85888',
      'こおり': '#98D8D8',
      'ドラゴン': '#7038F8',
      'あく': '#705848',
      'フェアリー': '#EE99AC'
    };
    return typeColors[type] || '#68A090';
  }
}