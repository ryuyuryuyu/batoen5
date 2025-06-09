// 全てのポケモンデータを取得する関数
export const getAllPokemon = async (url: string) => {
  // APIは時間がかかるため、Promiseを返す
  // Promiseは非同期処理を扱うためのオブジェクト
  return new Promise((resolve) => {
    // resにはjson形式でデータが入る
    // resolveでデータを返す
    fetch(url)
      .then((res) => res.json())
      .then((data) => resolve(data));
  });
};
// ポケモンの詳細データを取得する関数
export const getPokemon = async (url: string) => {
  return new Promise((resolve) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => resolve(data));
  });
};