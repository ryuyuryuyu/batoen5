import type { StatusCondition } from '../domain/models/StatusCondition';
import { StatusConditionFactory } from '../domain/factories/StatusConditionFactory';

/**
 * 状態異常リポジトリのインターフェース
 */
export interface IStatusConditionRepository {
  /**
   * 全ての状態異常を取得
   */
  getAll(): Promise<StatusCondition[]>;
}

/**
 * JSONファイルを使用した状態異常リポジトリの実装
 */
export class StatusConditionRepository implements IStatusConditionRepository {
  private statusConditionData: any[] | null = null;

  /**
   * JSONファイルから状態異常データを読み込み
   */
  private async loadStatusConditionData(): Promise<any[]> {
    if (this.statusConditionData === null) {
      try {
        const response = await fetch('/status_conditions_master.json');
        if (!response.ok) {
          throw new Error(`JSONファイルの読み込みに失敗しました: ${response.status}`);
        }
        this.statusConditionData = await response.json();
      } catch (error) {
        console.error('状態異常データの読み込みエラー:', error);
        throw new Error('状態異常データの読み込みに失敗しました');
      }
    }
    return this.statusConditionData ?? [];
  }

  /**
   * 全ての状態異常を取得
   */
  async getAll(): Promise<StatusCondition[]> {
    const data = await this.loadStatusConditionData();
    return StatusConditionFactory.createMultipleFromJson(data);
  }
}