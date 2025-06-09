import type { BattlePokemon } from '../domain/models/BattlePokemon';
import { BattlePokemonFactory } from '../domain/factories/BattlePokemonFactory';

/**
 * バトル用ポケモンリポジトリのインターフェース
 */
export interface IBattlePokemonRepository {
  /**
   * 全てのバトル用ポケモンを取得
   */
  getAll(): Promise<BattlePokemon[]>;
  
  /**
   * is_seedeがtrueのポケモンのみを取得
   */
  getSeededPokemons(): Promise<BattlePokemon[]>;
  
  /**
   * 名前でポケモンを検索
   * @param name ポケモン名
   */
  getByName(name: string): Promise<BattlePokemon | null>;
  
  /**
   * ポケモンの画像URLを取得
   * @param pokemonUrl PokeAPIのURL
   */
  getPokemonImageUrl(pokemonUrl: string): Promise<string>;
}

/**
 * JSONファイルを使用したバトル用ポケモンリポジトリの実装
 */
export class BattlePokemonRepository implements IBattlePokemonRepository {
  private pokemonData: any[] | null = null;

  /**
   * JSONファイルからポケモンデータを読み込み
   */
  private async loadPokemonData(): Promise<any[]> {
    if (this.pokemonData === null) {
      try {
        const response = await fetch('/pokemon_batoen_master.json');
        if (!response.ok) {
          throw new Error(`JSONファイルの読み込みに失敗しました: ${response.status}`);
        }
        this.pokemonData = await response.json();
      } catch (error) {
        console.error('ポケモンデータの読み込みエラー:', error);
        throw new Error('ポケモンデータの読み込みに失敗しました');
      }
    }
    return this.pokemonData ?? [];
  }

  /**
   * 全てのバトル用ポケモンを取得
   */
  async getAll(): Promise<BattlePokemon[]> {
    const data = await this.loadPokemonData();
    return BattlePokemonFactory.createMultipleFromJson(data);
  }

  /**
   * is_seedeがtrueのポケモンのみを取得
   */
  async getSeededPokemons(): Promise<BattlePokemon[]> {
    const data = await this.loadPokemonData();
    const seededData = data.filter(pokemon => pokemon.is_seede === true);
    return BattlePokemonFactory.createMultipleFromJson(seededData);
  }

  /**
   * 名前でポケモンを検索
   * @param name ポケモン名
   */
  async getByName(name: string): Promise<BattlePokemon | null> {
    const data = await this.loadPokemonData();
    return BattlePokemonFactory.createByName(data, name);
  }

  /**
   * PokeAPIからポケモンの画像URLを取得
   * @param pokemonUrl PokeAPIのURL
   */
  async getPokemonImageUrl(pokemonUrl: string): Promise<string> {
    try {
      const response = await fetch(pokemonUrl);
      if (!response.ok) {
        throw new Error(`PokeAPIの呼び出しに失敗しました: ${response.status}`);
      }
      const data = await response.json();
      return data.sprites?.front_default || '';
    } catch (error) {
      console.error('ポケモン画像の取得エラー:', error);
      // デフォルト画像またはエラー画像のURLを返す
      return '';
    }
  }
}