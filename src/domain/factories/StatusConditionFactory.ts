import { StatusCondition } from '../models/StatusCondition';

/**
 * JSONファイルから読み込む状態異常データの型定義
 */
interface StatusConditionJsonData {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
}

/**
 * 状態異常ファクトリークラス
 * JSONデータからStatusConditionエンティティを生成する
 */
export class StatusConditionFactory {
  /**
   * JSONデータからStatusConditionを生成
   * @param data JSONから読み込んだ状態異常データ
   * @returns StatusConditionインスタンス
   */
  static createFromJson(data: StatusConditionJsonData): StatusCondition {
    return new StatusCondition(
      data.id,
      data.name,
      data.description,
      data.backgroundColor,
      data.textColor
    );
  }

  /**
   * 複数のJSONデータからStatusConditionの配列を生成
   * @param dataArray JSONから読み込んだ状態異常データの配列
   * @returns StatusConditionインスタンスの配列
   */
  static createMultipleFromJson(dataArray: StatusConditionJsonData[]): StatusCondition[] {
    return dataArray.map(data => this.createFromJson(data));
  }
}