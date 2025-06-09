import { Pokemon } from '../domain/models/Pokemon';
import { PokemonFactory } from '../domain/factories/PokemonFactory';

/**
 * ポケモンリポジトリのインターフェース
 */
export interface IPokemonRepository {
  getAll(): Promise<Pokemon[]>;
  getByUrl(url: string): Promise<Pokemon>;
}

/**
 * PokeAPIを使用したポケモンリポジトリの実装
 */
export class PokemonRepository implements IPokemonRepository {
  async getAll(): Promise<Pokemon[]> {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
    const data = await response.json();
    return Promise.all(
      data.results.map((result: { url: string }) => this.getByUrl(result.url))
    );
  }

  async getByUrl(url: string): Promise<Pokemon> {
    const response = await fetch(url);
    const data = await response.json();
    
    // 日本語名を取得
    let jaName: string | undefined;
    try {
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const jaNameObj = speciesData.names.find((n: any) => n.language.name === 'ja');
      if (jaNameObj) {
        jaName = jaNameObj.name;
      }
    } catch (e) {
      console.error('日本語名の取得に失敗しました:', e);
    }

    return PokemonFactory.createFromApi(data, jaName);
  }
}