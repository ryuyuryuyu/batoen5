import { Pokemon } from '../../domain/models/Pokemon';
import type { IPokemonRepository } from '../../infrastructure/PokemonRepository';
import { makeAutoObservable } from 'mobx';

/**
 * ポケモン検索の状態を管理するViewModel
 */
export class PokemonViewModel {
  private pokemons: Pokemon[] = [];
  private filteredPokemons: Pokemon[] = [];
  private currentPage = 1;
  private readonly pageSize = 20;
  private repository: IPokemonRepository;
  loading = false;
  searchName = '';
  searchType = '';
  searchGeneration = '';

  constructor(repository: IPokemonRepository) {
    this.repository = repository;
    makeAutoObservable(this);
  }

  /**
   * 検索条件に基づいてポケモンをフィルタリング
   */
  async search(): Promise<void> {
    this.loading = true;
    try {
      if (this.pokemons.length === 0) {
        this.pokemons = await this.repository.getAll();
      }

      this.filteredPokemons = this.pokemons.filter(pokemon => {
        const searchTerm = this.searchName.toLowerCase();
        const nameMatch = this.searchName === '' ||
          pokemon.name.toLowerCase().includes(searchTerm) ||
          pokemon.jaName.toLowerCase().includes(searchTerm);

        const typeMatch = this.searchType === '' ||
          pokemon.types.some(t => t.jaName === this.searchType || t.name === this.searchType);

        // 世代フィルターは現在未実装
        const generationMatch = this.searchGeneration === '';

        return nameMatch && typeMatch && generationMatch;
      });

      this.currentPage = 1;
    } finally {
      this.loading = false;
    }
  }

  /**
   * 現在のページのポケモンを取得
   */
  getCurrentPagePokemons(): Pokemon[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPokemons.slice(start, end);
  }

  // ページネーション関連のメソッド
  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredPokemons.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPokemons.length / this.pageSize);
  }

  get currentPageNumber(): number {
    return this.currentPage;
  }
}