import { Pokemon } from '../models/Pokemon';
import type { PokemonType, PokemonAbility, PokemonStat } from '../models/Pokemon';

/**
 * PokeAPIのレスポンス型
 */
interface PokeApiResponse {
  id: number;
  name: string;
  types: Array<{
    type: {
      name: string;
      jaName?: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      jaName?: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
}

/**
 * ポケモンファクトリークラス
 * APIレスポンスからドメインモデルを生成する
 */
export class PokemonFactory {
  static createFromApi(data: PokeApiResponse, jaName?: string): Pokemon {
    const types: PokemonType[] = data.types.map(t => ({
      name: t.type.name,
      jaName: t.type.jaName || t.type.name
    }));

    const abilities: PokemonAbility[] = data.abilities.map(a => ({
      name: a.ability.name,
      jaName: a.ability.jaName || a.ability.name
    }));

    const stats: PokemonStat[] = data.stats.map(s => ({
      name: s.stat.name,
      jaName: this.translateStatName(s.stat.name),
      value: s.base_stat
    }));

    return new Pokemon(
      data.id,
      data.name,
      jaName || data.name,
      types,
      abilities,
      stats,
      data.weight,
      data.height,
      data.sprites.front_default
    );
  }

  /**
   * ステータス名を日本語に変換
   */
  private static translateStatName(name: string): string {
    const translations: Record<string, string> = {
      'hp': 'HP',
      'attack': 'こうげき',
      'defense': 'ぼうぎょ',
      'special-attack': 'とくこう',
      'special-defense': 'とくぼう',
      'speed': 'すばやさ'
    };
    return translations[name] || name;
  }
}