/**
 * バトル用ポケモンエンティティ
 * バトル中のポケモンの状態を管理する
 */
export class BattlePokemon {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _url: string;
  private readonly _types: string[];
  private readonly _maxHp: number;
  private _currentHp: number;
  private readonly _moveset: Record<string, string>;
  private readonly _evolutions: Array<{ before?: string; after?: string }>;
  private readonly _symbol: string;
  private _activeStatusConditions: string[] = [];
  private _hpHistory: number[] = [];

  constructor(
    id: number,
    name: string,
    url: string,
    types: string[],
    maxHp: number,
    moveset: Record<string, string>,
    evolutions: Array<{ before?: string; after?: string }>,
    symbol: string = '●'
  ) {
    this._id = id;
    this._name = name;
    this._url = url;
    this._types = types;
    this._maxHp = maxHp;
    this._currentHp = maxHp;
    this._moveset = moveset;
    this._evolutions = evolutions;
    this._symbol = symbol;
    this._hpHistory = [maxHp];
  }

  // ゲッター
  get id(): number { return this._id; }
  get name(): string { return this._name; }
  get url(): string { return this._url; }
  get types(): string[] { return [...this._types]; }
  get maxHp(): number { return this._maxHp; }
  get currentHp(): number { return this._currentHp; }
  get symbol(): string { return this._symbol; }
  get activeStatusConditions(): string[] { return [...this._activeStatusConditions]; }

  /**
   * 指定された番号の技を取得
   */
  getMove(moveNumber: number): string {
    return this._moveset[moveNumber.toString()] || 'ミス';
  }

  /**
   * ダメージを与える
   */
  takeDamage(damage: number): void {
    this._hpHistory.push(this._currentHp);
    this._currentHp = Math.max(0, this._currentHp - damage);
  }

  /**
   * HPを回復する
   */
  heal(amount: number): void {
    this._hpHistory.push(this._currentHp);
    this._currentHp = Math.min(this._maxHp, this._currentHp + amount);
  }

  /**
   * HPの変更を元に戻す
   */
  undoHpChange(): void {
    if (this._hpHistory.length > 1) {
      this._hpHistory.pop();
      this._currentHp = this._hpHistory[this._hpHistory.length - 1];
    }
  }

  /**
   * 状態異常を追加/削除
   */
  toggleStatusCondition(conditionId: string): void {
    const index = this._activeStatusConditions.indexOf(conditionId);
    if (index === -1) {
      this._activeStatusConditions.push(conditionId);
    } else {
      this._activeStatusConditions.splice(index, 1);
    }
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
   * HPを引き継いで新しいポケモンインスタンスを作成
   * 進化前のポケモンの最大HPから現在HPの差分を、進化後のポケモンの最大HPから減らす
   */
  createWithInheritedHp(
    id: number,
    name: string,
    url: string,
    types: string[],
    newMaxHp: number,
    moveset: Record<string, string>,
    evolutions: Array<{ before?: string; after?: string }>,
    symbol: string = '●'
  ): BattlePokemon {
    // 進化前のダメージ量を計算
    const damageAmount = this._maxHp - this._currentHp;
    
    // 進化後のHPを計算（最小値は0）
    const newCurrentHp = Math.max(0, newMaxHp - damageAmount);
    
    const newPokemon = new BattlePokemon(
      id,
      name,
      url,
      types,
      newMaxHp,
      moveset,
      evolutions,
      symbol
    );
    
    // HPを設定
    newPokemon._currentHp = newCurrentHp;
    
    // 状態異常を引き継ぎ
    newPokemon._activeStatusConditions = [...this._activeStatusConditions];
    
    // HPの履歴をリセット（新しいポケモンの現在HPから開始）
    newPokemon._hpHistory = [newCurrentHp];
    
    return newPokemon;
  }

  /**
   * 敗北判定
   */
  isDefeated(): boolean {
    return this._currentHp <= 0;
  }

  /**
   * プライマリタイプの色を取得
   */
  getPrimaryTypeColor(): string {
    const typeColorMap: Record<string, string> = {
      'ノーマル': '#A8A878',
      'かくとう': '#C03028',
      'ひこう': '#A890F0',
      'ほのお': '#F08030',
      'くさ': '#78C850',
      'みず': '#6890F0',
      'こおり': '#98D8D8',
      'どく': '#A040A0',
      'ゴースト': '#705898',
      'あく': '#705848',
      'エスパー': '#F85888',
      'フェアリー': '#EE99AC',
      'いわ': '#B8A038',
      'じめん': '#E0C068',
      'でんき': '#F8D030',
      'ドラゴン': '#7038F8',
      'はがね': '#B8B8D0',
      'むし': '#A8B820',
    };
    return typeColorMap[this._types[0]] || '#68A090';
  }

  /**
   * セカンダリタイプの色を取得
   */
  getSecondaryTypeColor(): string | null {
    if (this._types.length < 2) return null;
    
    const typeColorMap: Record<string, string> = {
      'ノーマル': '#A8A878',
      'かくとう': '#C03028',
      'ひこう': '#A890F0',
      'ほのお': '#F08030',
      'くさ': '#78C850',
      'みず': '#6890F0',
      'こおり': '#98D8D8',
      'どく': '#A040A0',
      'ゴースト': '#705898',
      'あく': '#705848',
      'エスパー': '#F85888',
      'フェアリー': '#EE99AC',
      'いわ': '#B8A038',
      'じめん': '#E0C068',
      'でんき': '#F8D030',
      'ドラゴン': '#7038F8',
      'はがね': '#B8B8D0',
      'むし': '#A8B820',
    };
    return typeColorMap[this._types[1]] || '#68A090';
  }
}