import { BattlePokemon, type Moveset, type Evolution } from '../models/BattlePokemon';

/**
 * JSONファイルから読み込むポケモンデータの型定義
 */
interface PokemonJsonData {
  id: number;
  is_seede: boolean;
  name: string;
  url: string;
  type: string[];
  baseStats: {
    hp: number;
  };
  moveset: Moveset;
  evolutions: Evolution[];
}

/**
 * バトル用ポケモンファクトリークラス
 * JSONデータからBattlePokemonエンティティを生成する
 */
export class BattlePokemonFactory {
  /**
   * JSONデータからBattlePokemonを生成
   * @param data JSONから読み込んだポケモンデータ
   * @returns BattlePokemonインスタンス
   */
  static createFromJson(data: PokemonJsonData): BattlePokemon {
    return new BattlePokemon(
      data.id,
      data.name,
      data.url,
      data.type,
      data.baseStats.hp,
      data.moveset,
      data.evolutions,
      data.is_seede
    );
  }

  /**
   * 複数のJSONデータからBattlePokemonの配列を生成
   * @param dataArray JSONから読み込んだポケモンデータの配列
   * @returns BattlePokemonインスタンスの配列
   */
  static createMultipleFromJson(dataArray: PokemonJsonData[]): BattlePokemon[] {
    return dataArray.map(data => this.createFromJson(data));
  }

  /**
   * 名前からポケモンを検索してBattlePokemonを生成
   * @param dataArray JSONから読み込んだポケモンデータの配列
   * @param name 検索するポケモン名
   * @returns 見つかったBattlePokemonインスタンス、見つからない場合はnull
   */
  static createByName(dataArray: PokemonJsonData[], name: string): BattlePokemon | null {
    const data = dataArray.find(pokemon => pokemon.name === name);
    return data ? this.createFromJson(data) : null;
  }
}