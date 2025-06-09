/**
 * ポケモンの種類を表す型
 */
export interface PokemonType {
  name: string;
  jaName: string;
}

/**
 * ポケモンの特性を表す型
 */
export interface PokemonAbility {
  name: string;
  jaName: string;
}

/**
 * ポケモンのステータスを表す型
 */
export interface PokemonStat {
  name: string;
  jaName: string;
  value: number;
}

/**
 * ポケモンエンティティ
 */
export class Pokemon {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _jaName: string;
  private readonly _types: PokemonType[];
  private readonly _abilities: PokemonAbility[];
  private readonly _stats: PokemonStat[];
  private readonly _weight: number;
  private readonly _height: number;
  private readonly _spriteUrl: string;

  constructor(
    id: number,
    name: string,
    jaName: string,
    types: PokemonType[],
    abilities: PokemonAbility[],
    stats: PokemonStat[],
    weight: number,
    height: number,
    spriteUrl: string
  ) {
    this._id = id;
    this._name = name;
    this._jaName = jaName;
    this._types = types;
    this._abilities = abilities;
    this._stats = stats;
    this._weight = weight;
    this._height = height;
    this._spriteUrl = spriteUrl;
  }

  // イミュータブルなデータ取得のためのゲッター
  get id(): number { return this._id; }
  get name(): string { return this._name; }
  get jaName(): string { return this._jaName; }
  get types(): PokemonType[] { return [...this._types]; }
  get abilities(): PokemonAbility[] { return [...this._abilities]; }
  get stats(): PokemonStat[] { return [...this._stats]; }
  get weight(): number { return this._weight; }
  get height(): number { return this._height; }
  get spriteUrl(): string { return this._spriteUrl; }

  // 派生データの計算メソッド
  getWeightInKg(): number {
    return this._weight * 0.1;
  }

  getHeightInM(): number {
    return this._height * 0.1;
  }
}