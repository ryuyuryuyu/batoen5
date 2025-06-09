import React from 'react';
import './Card.css';

// 型定義
interface Type {
    type: { name: string; jaName?: string };
}
interface Ability {
    ability: { name: string; jaName?: string };
}
interface Stat {
    base_stat: number;
    stat: { name: string; jaName?: string };
}
interface Pokemon {
    sprites: { front_default: string };
    jaName?: string;
    name: string;
    types: Type[];
    weight: number;
    height: number;
    abilities: Ability[];
    stats?: Stat[];
}

// タイプ名（日本語）→色設定
const typeColorMap: Record<string, { color: string; background: string }> = {
    'ノーマル': { color: '#000', background: '#fff' },
    'かくとう': { color: '#fff', background: '#444' },
    'ひこう': { color: '#fff', background: '#3399cc' },
    'ほのお': { color: '#ff0', background: '#e60000' },
    'くさ': { color: '#fff', background: '#3cb371' },
    'みず': { color: '#fff', background: '#0070dd' },
    'こおり': { color: '#0070dd', background: '#b3e6ff' },
    'どく': { color: '#fff', background: '#a040a0' },
    'ゴースト': { color: '#e75480', background: '#3b2063' },
    'あく': { color: '#fff', background: '#000' },
    'エスパー': { color: '#000', background: '#ffb6c1' },
    'フェアリー': { color: '#3399cc', background: '#e6ccff' },
    'いわ': { color: '#fff', background: '#8b5a2b' },
    'じめん': { color: '#000', background: '#ffa500' },
    'でんき': { color: '#000', background: '#ffe600' },
    'ドラゴン': { color: '#000', background: '#bfff00' },
};

const Card: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
    return <div className="card">
        <div className="cardImgTypeRowHorizontal">
            <div className="cardImg">
                <img src={pokemon.sprites.front_default} alt="" />
            </div>
            <div className="cardTypesRightVertical">
                {pokemon.types.map((type: Type) => {
                    const jaType = type.type.jaName || type.type.name;
                    const style = typeColorMap[jaType] || { color: '#fff', background: '#888' };
                    return (
                        <span
                            key={type.type.name}
                            className="typeBadge"
                            style={{ color: style.color, background: style.background }}
                        >
                            {jaType}
                        </span>
                    );
                })}
            </div>
        </div>
        <h3 className='cardName'>{pokemon.jaName || pokemon.name}</h3>
        <div className='cardNameEn'>{pokemon.name}</div>
        <div className="cardInfoRow">
            <div className="cardInfoLeft">
                <div className="cardData">
                    <p className='title'>重さ：{(pokemon.weight * 0.1).toFixed(1)}kg</p>
                </div>
                <div className="cardData">
                    <p className='title'>高さ：{(pokemon.height * 0.1).toFixed(1)}m</p>
                </div>
                <div className="cardData">
                    <span className='title'>とくせい：</span>
                    <div className="abilityListVertical">
                        {pokemon.abilities.map((ab: Ability) => (
                            <span key={ab.ability.name}>
                                {ab.ability.jaName || ab.ability.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="cardInfoRight">
                <span className='title'>能力値：</span>
                <div className="statsList">
                    {pokemon.stats && pokemon.stats.map((stat: any) => (
                        <div key={stat.stat.name} className="statRow">
                            <span className="statName">
                                {(() => {
                                    switch (stat.stat.name) {
                                        case 'hp': return 'HP';
                                        case 'attack': return 'こうげき';
                                        case 'defense': return 'ぼうぎょ';
                                        case 'special-attack': return 'とくこう';
                                        case 'special-defense': return 'とくぼう';
                                        case 'speed': return 'すばやさ';
                                        default: return stat.stat.name;
                                    }
                                })()}
                            </span>
                            <span className="statValue">{stat.base_stat}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>;
};

export default Card;