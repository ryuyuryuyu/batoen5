/**
 * 状態異常エンティティ
 */
export class StatusCondition {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _backgroundColor: string;
  private readonly _textColor: string;

  constructor(
    id: string,
    name: string,
    description: string,
    backgroundColor: string,
    textColor: string
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._backgroundColor = backgroundColor;
    this._textColor = textColor;
  }

  // ゲッター
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get backgroundColor(): string { return this._backgroundColor; }
  get textColor(): string { return this._textColor; }
}