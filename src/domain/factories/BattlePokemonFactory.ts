import { BattlePokemon } from '../models/BattlePokemon';

/**
 * JSONファイルから読み込むポケモンデータの型定義
 */
interface BattlePokemonJsonData {
  id: number;
  is_seede: boolean;
  name: string;
  url: string;
  type: string[];
  baseStats: {
    hp: number;
  };
  moveset: Record<string, string>;
  evolutions: Array<{
    before?: string;
    after?: string;
  }>;
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
  static createFromJson(data: BattlePokemonJsonData): BattlePokemon {
    return new BattlePokemon(
      data.id,
      data.name,
      data.url,
      data.type,
      data.baseStats.hp,
      data.moveset,
      data.evolutions,
      '●' // デフォルトシンボル
    );
  }

  /**
   * 複数のJSONデータからBattlePokemonの配列を生成
   * @param dataArray JSONから読み込んだポケモンデータの配列
   * @returns BattlePokemonインスタンスの配列
   */
  static createMultipleFromJson(dataArray: BattlePokemonJsonData[]): BattlePokemon[] {
    return dataArray.map(data => this.createFromJson(data));
  }

  /**
   * 名前でポケモンを検索してBattlePokemonを生成
   * @param dataArray JSONから読み込んだポケモンデータの配列
   * @param name 検索するポケモン名
   * @returns 見つかったBattlePokemonインスタンス、見つからない場合はnull
   */
  static createByName(dataArray: BattlePokemonJsonData[], name: string): BattlePokemon | null {
    const pokemonData = dataArray.find(pokemon => pokemon.name === name);
    return pokemonData ? this.createFromJson(pokemonData) : null;
  }

  /**
   * HPを引き継いで新しいBattlePokemonを作成
   * @param originalPokemon 元のポケモン
   * @param newData 新しいポケモンのデータ
   * @returns HPを引き継いだ新しいBattlePokemonインスタンス
   */
  static createWithInheritedHp(
    originalPokemon: BattlePokemon,
    newData: BattlePokemonJsonData
  ): BattlePokemon {
    return originalPokemon.createWithInheritedHp(
      newData.id,
      newData.name,
      newData.url,
      newData.type,
      newData.baseStats.hp,
      newData.moveset,
      newData.evolutions,
      '●'
    );
  }
}