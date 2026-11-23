// ===== 英語表示（i18n） =====
// 画面に出る日本語を、表示の直前に英語へ置き換える。
// ・EN：日本語の文言 → 英語（完全一致）
// ・PATTERNS：数字などが入る文言は正規表現で置き換え
// ・.notr の中（デッキ名・メモなど自分で書いた文字）は置き換えない
// 言語を切り替えたらページを読み込み直す。
(function(){
const LS_LANG = "horobeat_lang";
let lang = null;
try { lang = localStorage.getItem(LS_LANG); } catch {}
if (lang !== "ja" && lang !== "en") lang = /^ja\b/i.test(navigator.language || "ja") ? "ja" : "en";
window.LANG = lang;
window.setLang = l => { try { localStorage.setItem(LS_LANG, l); } catch {} location.reload(); };
document.documentElement.lang = lang;

// ---- 用語集（設定タブで表示） ----
window.GLOSSARY = [
  ["カードの種類・色", "Card types and colors", [
    ["ホロビト","Horobito"],["ワザ","Technique"],["赤 / 緑 / 青","Red / Green / Blue"]]],
  ["トリガー", "Triggers", [
    ["エントリートリガー","Entry Trigger"],["オーバートリガー","Over Trigger"],["ドロートリガー","Draw Trigger"],["ラストオーバートリガー","Last Over Trigger"]]],
  ["キーワード能力", "Keyword abilities", [
    ["ダブルダメージ","Double Damage"],["1バリア / 2バリア","Barrier 1 / Barrier 2"],["エナ詠み赤3","Energy Reading: Red 3"],["共鳴：ライガ","Resonance: Raiga"]]],
  ["場所・状態", "Zones and states", [
    ["エナ / エナゾーン","Energy / Energy Zone"],["ライン（第1〜5ライン）","Battle Line (Line 1–5 in card text)"],["正面のホロビト","opposing Horobito"],["隣のライン","adjacent Line"],
    ["ハート","Heart Zone (one card: Heart)"],["山札 / 手札","Deck / hand"],["墓地","Trash"],["未使用 / 使用済み","unused / used"],["下にあるカード","cards underneath"]]],
  ["行動・ルール", "Actions and rules", [
    ["オーバービート","Overbeat"],["ブースト","Boost"],["ダウン（する）","Down / downed"],["回復（する）","Recover"],["破壊（する）","Destroy"],
    ["出たとき / 出す","When you summon this Horobito / summon"],["引く / 捨てる / 見せる","draw / discard / reveal"],["バトル","Battle"],["パワー / コスト","Power / Cost"],
    ["先手","go first"],["ラウンド","Round"],["召喚フェイズ","Summon Phase"],["トドメは刺せない","can't deliver the finishing blow"]]],
  ["種族", "Tribes", [
    ["ライガ・ファミリー","Raiga Family"],["フウガ・ファミリー","Fuga Family"],["コンガ・ファミリー","Konga Family"],
    ["ユウキ・コミューン","Yuki Commune"],["マボロシ・コミューン","Maboroshi Commune"],["オウチ・コミューン","Ouchi Commune"],
    ["スザク・ブラッド","Suzaku Blood"],["ラシャ・ブラッド","Rasha Blood"],["タイジュ・ブラッド","Taiju Blood"],
    ["ユルフワ・クラブ","Yurufuwa Club"],["バクソウ・クラブ","Bakuso Club"],["ビックリ・クラブ","Bikkuri Club"],
    ["ジャスティス・オーダー","Justice Order"],["ギルド・オーダー","Guild Order"],["チャラ・オーダー","Chara Order"],
    ["ウラロジ・ギャング","Uraroji Gang"],["ドクロ・ギャング","Dokuro Gang"],["スパイダー・ギャング","Spider Gang"],["ナガレモノ","Nagaremono"]]],
];

// ---- カードの効果文の英訳（非公式。効果文の1行ごと） ----
window.EFFECT_EN = {
"●このホロビトのバトル中、正面のホロビトはブーストを使えない。": "● While this Horobito is in a Battle, the opposing Horobito can't use Boost.",
"●1バリア（バトルに負けたとき、プレイヤーが受けるダメージは1減る）": "● Barrier 1 (When this Horobito loses a Battle, the damage its player takes is reduced by 1.)",
"●このホロビトが出たとき、相手のホロビトのみがいるラインを1つ選び、そのラインに移動してもよい。": "● When you summon this Horobito, you may choose a Line that has only an opponent's Horobito and move this Horobito to that Line.",
"●このホロビトが出たとき、各プレイヤーはハートを回復する。": "● When you summon this Horobito, each player Recovers their Hearts.",
"●このホロビトがバトルに勝ったとき、正面のホロビトの一番上のカードは、このラウンド中効果を失う。": "● When this Horobito wins a Battle, the top card of the opposing Horobito loses its abilities this Round.",
"（トリガーなどで別のホロビトになったなら、その効果は失わせない）": "(If it becomes a different Horobito, such as through a Trigger, that Horobito doesn't lose its abilities.)",
"●ダブルダメージ（バトルに勝ったなら、相手プレイヤーに1ではなく2ダメージを与える）": "● Double Damage (If this Horobito wins a Battle, it deals 2 damage to the opponent instead of 1.)",
"●このホロビトを手札から出すなら、オーバービートでは出せない。": "● If you summon this Horobito from your hand, you can't summon it with Overbeat.",
"●このホロビトが出たとき、相手のホロビトを1体選び、このホロビトの正面のホロビトと入れ替えてもよい。": "● When you summon this Horobito, you may choose 1 of your opponent's Horobito and have it switch Lines with the Horobito opposing this one.",
"（正面にホロビトがいないなら、入れ替えることはできない）": "(If there's no Horobito opposing this one, you can't switch them.)",
"●共鳴：ライガ（このワザを使うホロビトの種族がライガであるなら、このワザは以下の効果を得る）": "● Resonance: Raiga (If the Horobito using this Technique is a Raiga, this Technique gains the following abilities.)",
"・このワザを使ったとき、カードを1枚引く。": "- When you use this Technique, draw 1 card.",
"・このワザのパワーを+1000する。": "- This Technique gets +1000 Power.",
"●このホロビトが出たとき、カードを1枚引く。": "● When you summon this Horobito, draw 1 card.",
"●エナ詠み赤3（自分のエナゾーンに赤のエナが3枚以上あるなら、このホロビトは以下の効果を得る）": "● Energy Reading: Red 3 (If you have 3 or more Red Energy in your Energy Zone, this Horobito gains the following ability.)",
"・パワーを+2000する。": "- This Horobito gets +2000 Power.",
"●このホロビトが出たとき、自分のホロビトを1体選び、回復する。": "● When you summon this Horobito, choose 1 of your Horobito and Recover it.",
"●このワザは第2～5ラインのホロビトのみ使える。": "● Only a Horobito on Line 2–5 can use this Technique.",
"●このホロビトには、オーバービートできない。": "● You can't Overbeat onto this Horobito.",
"●このホロビトが第2～5ラインにいるなら、パワーを+2000する。": "● If this Horobito is on Line 2–5, it gets +2000 Power.",
"●このホロビトがダウンしていないなら、パワーを+2000する。": "● If this Horobito isn't Down, it gets +2000 Power.",
"●このホロビトのバトルが終わったとき、このホロビトを回復する。": "● When this Horobito's Battle ends, Recover this Horobito.",
"・ダウンしていないなら、パワーを+3000する。": "- If this Horobito isn't Down, it gets +3000 Power.",
"●このワザは下にカードが1枚以上あるホロビトのみ使える。": "● Only a Horobito with 1 or more cards underneath it can use this Technique.",
"●このホロビトは、隣のラインにパワー4000以上のホロビトがいないなら出せない。": "● You can't summon this Horobito unless there's a Horobito with 4000 or more Power on an adjacent Line.",
"●このホロビトは破壊されない。": "● This Horobito can't be destroyed.",
"●このホロビトがダウンしていないなら、パワーを+3000し、ダブルダメージを得る。": "● If this Horobito isn't Down, it gets +3000 Power and gains Double Damage.",
"（ダブルダメージを持つホロビトがバトルに勝ったなら、相手プレイヤーに1ではなく2ダメージを与える）": "(If a Horobito with Double Damage wins a Battle, it deals 2 damage to the opponent instead of 1.)",
"●このホロビトが出たとき、自分のホロビトを1体選び、それと位置を入れ替えてもよい。": "● When you summon this Horobito, you may choose 1 of your other Horobito and have this Horobito switch Lines with it.",
"●このホロビトが出たとき、自分のエナを1枚選び、墓地に置く。": "● When you summon this Horobito, choose 1 of your Energy and put it into your Trash.",
"●このワザは、自分のホロビトが4体以上ラインに出ているときのみ使える。": "● You can use this Technique only while you have 4 or more Horobito on your Lines.",
"●このバトルに勝ったなら、このホロビトが相手プレイヤーに与えるダメージを+1する。": "● If this Horobito wins this Battle, the damage it deals to the opponent is increased by 1.",
"●このワザを使ったとき、相手プレイヤーに1ダメージを与える。ただし、この効果でトドメは刺せない。": "● When you use this Technique, deal 1 damage to the opponent. This effect can't deliver the finishing blow.",
"●このホロビトが出たとき、手札からコスト2以下の赤のホロビトを1体、ラインに出してもよい。": "● When you summon this Horobito, you may summon 1 Red Horobito with cost 2 or less from your hand onto a Line.",
"（コストは支払わない）": "(Don't pay its cost.)",
"●このホロビトのバトルが終わったとき、自分の赤のエナを1枚選ぶ。それを未使用にし、このホロビトを回復する。": "● When this Horobito's Battle ends, choose 1 of your Red Energy. Make it unused, and Recover this Horobito.",
"●このホロビトが第2～5ラインにいるなら、このホロビトはダブルダメージを得る。": "● If this Horobito is on Line 2–5, it gains Double Damage.",
"●このホロビトが第3～5ラインにいるなら、バトルが終わったとき、正面のホロビトを回復させ、カードを1枚引く。": "● If this Horobito is on Line 3–5, when its Battle ends, Recover the opposing Horobito and draw 1 card.",
"●自分の赤のホロビトが4体以上ラインに出ているなら、このホロビトのパワーを+5000する。": "● If you have 4 or more Red Horobito on your Lines, this Horobito gets +5000 Power.",
"●このホロビトがラインに出ているなら、コストは1大きくなる。": "● While this Horobito is on your Lines, its cost is increased by 1.",
"●このホロビトが出たとき、山札の一番上を見る。そのカードを山札の一番下に置いてもよい。": "● When you summon this Horobito, look at the top card of your deck. You may put it on the bottom of your deck.",
"●エナ詠み緑3（自分のエナゾーンに緑のエナが3枚以上あるなら、このホロビトは以下の効果を得る）": "● Energy Reading: Green 3 (If you have 3 or more Green Energy in your Energy Zone, this Horobito gains the following ability.)",
"・パワーを+3000する。": "- This Horobito gets +3000 Power.",
"●このホロビトの下にあるカードの枚数が、正面のホロビトの下にあるカードの枚数より多いなら、このワザのパワーを+2000する。": "● If this Horobito has more cards underneath it than the opposing Horobito, this Technique gets +2000 Power.",
"●このワザは、第1～2ラインのホロビトのみ使える。": "● Only a Horobito on Line 1–2 can use this Technique.",
"●このホロビトのバトルが終わったとき、このホロビトに1ダメージを与える。": "● When this Horobito's Battle ends, deal 1 damage to this Horobito.",
"●このホロビトが出たとき、自分のホロビトを1体選ぶ。手札からコスト5以下のホロビトを1体選び、そのホロビトの一番下に置いてもよい。そうしたなら、カードを1枚引く。": "● When you summon this Horobito, choose 1 of your Horobito. You may choose 1 Horobito with cost 5 or less from your hand and put it underneath that Horobito, below any cards already there. If you do, draw 1 card.",
"●このホロビトにブーストを使っているなら、パワーは+2000される。": "● If you're using Boost on this Horobito, it gets +2000 Power.",
"・このホロビトが出たとき、自分の手札からコスト7以上のホロビトを1体見せてもよい。そうしたなら、カードを1枚引く。": "- When you summon this Horobito, you may reveal 1 Horobito with cost 7 or more from your hand. If you do, draw 1 card.",
"●このホロビトはバトル中、ワザやブーストでパワーが上がらない。": "● During Battles, this Horobito's Power can't be increased by Techniques or Boost.",
"●自分の第1～2ラインにいるホロビトの下にあるカードの合計が3枚以上なら、このホロビトのパワーを+3000し、ダブルダメージを得る。": "● If your Horobito on Line 1–2 have a total of 3 or more cards underneath them, this Horobito gets +3000 Power and gains Double Damage.",
"●このホロビトがバトルに勝ったとき、カードを1枚引く。": "● When this Horobito wins a Battle, draw 1 card.",
"●共鳴：スザク（このワザを使うホロビトの種族がスザクであるなら、このワザは以下の効果を得る）": "● Resonance: Suzaku (If the Horobito using this Technique is a Suzaku, this Technique gains the following abilities.)",
"・このワザを使ったとき、相手は手札を1枚選んで捨てる。": "- When you use this Technique, your opponent chooses 1 card from their hand and discards it.",
"・このバトルに勝ったとき、自分はカードを1枚引く。": "- When you win this Battle, draw 1 card.",
"●自分がこのラウンド先手なら、このワザのパワーを+2000する。": "● If you go first this Round, this Technique gets +2000 Power.",
"●2バリア（バトルに負けたとき、プレイヤーが受けるダメージは2減る）": "● Barrier 2 (When this Horobito loses a Battle, the damage its player takes is reduced by 2.)",
"●このホロビトがラインに出ているなら、コストは1小さくなる。": "● While this Horobito is on your Lines, its cost is decreased by 1.",
"●このホロビトが《ビュンドローン》以外にオーバービートされたとき、カードを1枚引く。": "● When a Horobito other than 《ビュンドローン》 (Byun Drone) is summoned onto this Horobito with Overbeat, draw 1 card.",
"●このホロビトはワザを使えない。": "● This Horobito can't use Techniques.",
"●相手のホロビトがワザを使っているなら、このホロビトのパワーを+4000する。": "● If an opponent's Horobito is using a Technique, this Horobito gets +4000 Power.",
"●自分の第1～2ラインにいるホロビトの下にあるカードの合計が5枚以上なら、パワーを+5000する。": "● If your Horobito on Line 1–2 have a total of 5 or more cards underneath them, this Horobito gets +5000 Power.",
"●このホロビトと正面のホロビトはバトル中、ワザやブーストでパワーが上がらない。": "● During Battles, the Power of this Horobito and the opposing Horobito can't be increased by Techniques or Boost.",
"●このワザは、下にあるカードが2枚以上のホロビトのみ使える。": "● Only a Horobito with 2 or more cards underneath it can use this Technique.",
"・このホロビトがバトルに勝ったとき、第1～2ラインにいるなら、相手は手札を1枚選んで捨てる。": "- When this Horobito wins a Battle, if it's on Line 1–2, your opponent chooses 1 card from their hand and discards it.",
"・このホロビトがバトルに勝ったとき、カードを3枚引く。": "- When this Horobito wins a Battle, draw 3 cards.",
"●このホロビトがバトルに勝ったとき、このホロビトのパワーが正面のホロビトの2倍以上なら、正面のホロビトを破壊する。": "● When this Horobito wins a Battle, if its Power is at least twice the opposing Horobito's Power, destroy the opposing Horobito.",
"（バリアや負けたときの効果は発動しない）": "(Barrier and \"when it loses\" abilities don't activate.)",
"●このホロビトがバトルに負けたとき、このホロビトのバリアで減らす分のダメージを相手プレイヤーに与える。ただし、この効果でトドメは刺せない": "● When this Horobito loses a Battle, deal damage to the opponent equal to the damage reduced by this Horobito's Barrier. This effect can't deliver the finishing blow.",
"●このホロビトがワザを使っているなら、パワーを+3000する。": "● If this Horobito is using a Technique, it gets +3000 Power.",
"●このホロビトがダウンしたとき、自分のエナを1枚選び、未使用にする。": "● When this Horobito becomes Down, choose 1 of your Energy and make it unused.",
"●自分のエナゾーンにカードが8枚以上あるなら、このホロビトのパワーを+4000する。": "● If you have 8 or more cards in your Energy Zone, this Horobito gets +4000 Power.",
"●エナ詠み青3（自分のエナゾーンに青のエナが3枚以上あるなら、このワザは以下の効果を得る）": "● Energy Reading: Blue 3 (If you have 3 or more Blue Energy in your Energy Zone, this Technique gains the following ability.)",
"・このバトルが終わったとき、自分のエナを1枚選び、未使用にする。": "- When this Battle ends, choose 1 of your Energy and make it unused.",
"●このワザは下にあるカードが1枚以下のホロビトのみ使える。": "● Only a Horobito with 1 or fewer cards underneath it can use this Technique.",
"●このホロビトのバトルが終わったとき、このバトルで使われていたコスト1のワザを1枚選ぶ。そのカードを次のラインに使ってもよい。": "● When this Horobito's Battle ends, choose 1 Technique with cost 1 that you used in this Battle. You may use that card for your Horobito on the next Line.",
"（ホロビトがいないラインではワザは使えない）": "(Techniques can't be used on a Line with no Horobito.)",
"●このホロビトが出たとき、手札からコスト2以上のワザ1枚を選び、捨ててもよい。そうしたなら、自分のエナを1枚選び、未使用にする。": "● When you summon this Horobito, you may choose 1 Technique with cost 2 or more from your hand and discard it. If you do, choose 1 of your Energy and make it unused.",
"●エナ詠み青3（自分のエナゾーンに青のエナが3枚以上あるなら、このホロビトは以下の効果を得る）": "● Energy Reading: Blue 3 (If you have 3 or more Blue Energy in your Energy Zone, this Horobito gains the following ability.)",
"・ワザを使っていれば、パワーを+3000し、ダブルダメージを得る。": "- If this Horobito is using a Technique, it gets +3000 Power and gains Double Damage.",
"●このホロビトがダウンしているなら、このホロビトのパワーを+3000する。": "● If this Horobito is Down, it gets +3000 Power.",
"●このホロビトのバトルが終わったとき、お互いのプレイヤーは自分の墓地のワザを1枚選び、エナに使用済みで置いてもよい。": "● When this Horobito's Battle ends, each player may choose 1 Technique in their Trash and put it into their Energy Zone as used.",
"●共鳴：ジャスティス（このワザを使うホロビトの種族がジャスティスであるなら、このワザは以下の効果を得る）": "● Resonance: Justice (If the Horobito using this Technique is a Justice, this Technique gains the following ability.)",
"・このワザのパワーを+3000する。": "- This Technique gets +3000 Power.",
"●このワザを使ったとき、各プレイヤーは山札の一番上のカードをエナゾーンに使用済みで置く。": "● When you use this Technique, each player puts the top card of their deck into their Energy Zone as used.",
"・このホロビトが出たとき、自分の山札の上から5枚を見る。その中からワザを1枚見せ、手札に加えてもよい。残りを好きな順で山札の一番下に置く。": "- When you summon this Horobito, look at the top 5 cards of your deck. You may reveal 1 Technique from among them and put it into your hand. Put the rest on the bottom of your deck in any order.",
"●このホロビトが破壊されたとき、このカードを墓地に置くかわりに自分のエナに未使用で置く。": "● When this Horobito is destroyed, put this card into your Energy Zone as unused instead of putting it into your Trash.",
"●手札が6枚以上あるなら、このホロビトのパワーを+6000する。": "● If you have 6 or more cards in your hand, this Horobito gets +6000 Power.",
"●このホロビトが出たとき、各プレイヤーは山札の一番上のカードをエナゾーンに使用済みで置く。": "● When you summon this Horobito, each player puts the top card of their deck into their Energy Zone as used.",
"●このホロビトが出たとき、両隣のラインにいる自分のホロビト1体を選び、位置を入れ替えてもよい。": "● When you summon this Horobito, you may choose 1 of your Horobito on an adjacent Line and have this Horobito switch Lines with it.",
"●このホロビトがダウンしたとき、このカードを手札に戻す。": "● When this Horobito becomes Down, return this card to your hand.",
"（この下にあるカードはラインに残る）": "(The cards underneath it stay on the Line.)",
"●このホロビトのバトルが始まったとき、自分のエナにあるコスト3以下の青のワザ1枚を選び、使用してもよい。": "● When this Horobito's Battle starts, you may choose 1 Blue Technique with cost 3 or less in your Energy Zone and use it.",
"●このワザは自分がこのバトルで他のワザを使っているときのみ使える。": "● You can use this Technique only if you've already used another Technique in this Battle.",
"●バトルが終わったとき、このカードを手札に戻す。": "● When the Battle ends, return this card to your hand.",
"●自分が召喚フェイズを終えたとき、墓地にあるコスト1のワザを1枚選び、それを手札に戻してもよい。": "● When you end your Summon Phase, you may choose 1 Technique with cost 1 in your Trash and return it to your hand.",
"●このホロビトが2つ目のワザを使ったとき、正面のホロビトのコストが8以下なら、その一番上のカードを手札に戻す。": "● When this Horobito uses its second Technique, if the opposing Horobito's cost is 8 or less, return its top card to its owner's hand.",
"●自分にダウンしているハートがあるなら、このホロビトのパワーを+4000する。": "● If you have a Down Heart, this Horobito gets +4000 Power.",
"●このホロビトがバトルに勝ったとき、ダウンしているハートがあるなら、回復する。そうでなければ、山札の上から1枚をダウンさせてハートに加える。": "● When this Horobito wins a Battle, if you have a Down Heart, Recover it. Otherwise, add the top card of your deck to your Heart Zone Down.",
"●このホロビトのバトルが終わったとき、自分のエナを全て未使用にする。その後、自分のエナを4枚選び、それを使用済みにする。": "● When this Horobito's Battle ends, make all of your Energy unused. Then choose 4 of your Energy and make them used.",
"●このホロビトが第2～5ラインにいるなら、このホロビトのパワーを+2500する。": "● If this Horobito is on Line 2–5, it gets +2500 Power.",
"（ダウンしているこのホロビトがダメージを受けるとき、ダウンしたままラインに残る）": "(When this Horobito is Down and would take damage, it stays on its Line, still Down.)",
"●このホロビトがバトルに勝ったとき、第2～5ラインにいるなら、カードを1枚引く。": "● When this Horobito wins a Battle, if it's on Line 2–5, draw 1 card.",
"●このホロビトが出たとき、下にカードがないなら、カードを1枚引く。": "● When you summon this Horobito, if there are no cards underneath it, draw 1 card.",
"●このホロビトがブーストを使っているなら、このホロビトのパワーは+3000される。": "● If you're using Boost on this Horobito, it gets +3000 Power.",
"（2回以上ブーストしていても、この効果は1度しか発動しない）": "(Even if you Boost it 2 or more times, this ability applies only once.)",
"●このホロビトのバトルが終わったとき、自分のホロビトを1体選び、回復する。": "● When this Horobito's Battle ends, choose 1 of your Horobito and Recover it.",
"●自分のホロビトが4体以上ラインに出ているなら、このホロビトのパワーを+4000する。": "● If you have 4 or more Horobito on your Lines, this Horobito gets +4000 Power.",
"●このホロビトがオーバービートされるとき、このホロビトがダウンしているなら、カードを1枚引く。": "● When a Horobito is summoned onto this Horobito with Overbeat, if this Horobito is Down, draw 1 card.",
"（ワザでは発動しない）": "(Using a Technique doesn't count.)",
"●このホロビトがダウンしたとき、カードを2枚引く。": "● When this Horobito becomes Down, draw 2 cards.",
"●このホロビトの下にカードが2枚以上あるなら、パワーを+3000する。": "● If this Horobito has 2 or more cards underneath it, it gets +3000 Power.",
"●このホロビトが破壊されたとき、カードを1枚引く。": "● When this Horobito is destroyed, draw 1 card.",
"●このホロビトにブーストを使ったとき、カードを1枚引く。": "● When you use Boost on this Horobito, draw 1 card.",
"●このホロビトはバトルに負けてもダメージを受けない。": "● This Horobito doesn't take damage even if it loses a Battle.",
"（自分のハートはダメージを受ける）": "(Your Hearts still take damage.)",
"（正面に相手のホロビトがいない場合も発動する）": "(This also activates when there's no opposing Horobito.)",
"●ダブルダメージ（バトルに勝ったなら、相手プレイヤーに1ではなく2ダメージ与える）": "● Double Damage (If this Horobito wins a Battle, it deals 2 damage to the opponent instead of 1.)",
"●このホロビトにはオーバービートできない。": "● You can't Overbeat onto this Horobito.",
"●このホロビトが出たとき、カードを2枚引く。": "● When you summon this Horobito, draw 2 cards.",
"●自分のホロビトが4体以上いるなら、このホロビトのパワーを+3000する。": "● If you have 4 or more Horobito on your Lines, this Horobito gets +3000 Power.",
"●このワザを使ったとき、このホロビトを回復する。": "● When you use this Technique, Recover this Horobito.",
"●このホロビトの下にカードが2枚以上あるなら、このホロビトのパワーを+2000する。": "● If this Horobito has 2 or more cards underneath it, it gets +2000 Power."
};
// 効果文全体を英訳する（訳がない行があれば null）
window.effectEn = text => { const out = []; for (const l of String(text).split("\n")) { const k = l.trim(); if (!k) continue; const e = EFFECT_EN[k]; if (!e) return null; out.push((/^[　\s]/.test(l) ? "　" : "") + e); } return out.join("\n"); };

// ---- 収録先（日本語と英語の両方を出す） ----
const SETS_EN = {
  "HB-BP01 拡張パック第一弾 ホロビート": "Booster Pack Vol.1",
  "HB-SD01 スタートデッキ レオジン 赤": "Starter Deck Leojin Red",
  "HB-SD02 スタートデッキ 不死火 緑": "Starter Deck Shinazui Green",
  "コロコロコミック付録デッキ2026 赤": "CoroCoro Comic Bonus Deck 2026 Red",
  "コロコロコミック付録デッキ2026 緑": "CoroCoro Comic Bonus Deck 2026 Green",
  "PRカード【HB-BP01 BOX特典】": "Promo: Booster Pack Vol.1 Box Bonus",
  "大合戦ホロモーションパック 一の巻": "Holomotion Pack Vol.1",
  "ホロビート名人戦 優勝賞": "HOROBEAT Meijin-sen Winner Prize",
  "PRカード": "Promo Cards",
};
window.setLabel = name => lang === "en" && SETS_EN[name] ? `${name} / ${SETS_EN[name]}` : name;

// ---- 文言（完全一致） ----
const EN = {
  // ヘッダー・タブ
  "ホロビート": "HOROBEAT", "デッキ構築": "Deck Builder", "ファンツール": "Fan Tools", "HOROBEAT ファンツール": "HOROBEAT Fan Tools",
  "カード": "Cards", "デッキ": "Decks", "イベント": "Events", "設定": "Settings",
  "クリック：追加　右クリック：削除　ⓘ：詳細 ／ 50枚ちょうど・同名4枚まで": "Click: add   Right-click: remove   ⓘ: details / exactly 50 cards, max 4 of the same name",
  // データの値
  "ホロビト": "Horobito", "ワザ": "Technique", "赤": "Red", "緑": "Green", "青": "Blue",
  "エントリートリガー": "Entry Trigger", "オーバートリガー": "Over Trigger", "ドロートリガー": "Draw Trigger", "ラストオーバートリガー": "Last Over Trigger",
  "エントリー": "Entry", "オーバー": "Over", "ドロー": "Draw", "ラストオーバー": "Last Over",
  "ダブルダメージ": "Double Damage", "バリア": "Barrier", "エナ詠み": "Energy Reading", "共鳴": "Resonance",
  "あり": "Yes", "なし": "No",
  // デッキ一覧
  "デッキ一覧": "Decks", "QRで送る": "Send via QR", "QRで受け取る": "Receive via QR", "＋ 新規": "＋ New",
  "色で絞り込み": "Filter by color", "選んだ色のデッキはありません": "No decks with the selected colors",
  "＋ 新規デッキを作る": "＋ Create a new deck", "対戦記録": "Match log", "複製": "Copy", "削除": "Delete", "削除しました": "Deleted",
  "新しいデッキ": "New deck", "無題": "Untitled", "前回のデッキ": "Previous deck",
  // カード一覧・絞り込み
  "絞り込み": "Filters", "カード名・能力で検索": "Search by name or ability", "カード名・能力・種族で検索": "Search by name, ability, or tribe",
  "色": "Color", "タイプ": "Type", "コスト": "Cost", "レア": "Rarity",
  "収録先：すべて": "Set: all", "種族：すべて": "Tribe: all", "キーワード：すべて": "Keyword: all", "トリガー：すべて": "Trigger: all", "ブースト：すべて": "Boost: all",
  "条件クリア": "Clear filters", "同名カードをまとめる": "Group same-name cards", "4枚未満のカードだけ": "Only cards with fewer than 4",
  "書き出し/読込": "Export / Import", "並び順": "Sort", "カード番号": "Card number", "パワー": "Power", "名前": "Name", "詳細": "Details",
  // デッキ構築
  "← 一覧へ": "← Decks", "保存": "Save", "画像出力": "Image", "試しに引く": "Test draw", "全削除": "Clear all",
  "まだ保存されていません": "Not saved yet", "デッキ名（変更は自動保存）": "Deck name (changes are saved automatically)",
  "コスト分布（橙=ホロビト／青=ワザ）": "Cost curve (orange = Horobito / blue = Technique)", "内訳": "Breakdown",
  "タップ：追加": "Tap: add", "長押し：1枚削除": "Long-press: remove 1", "タップ：所持+1": "Tap: +1 owned", "長押し：所持−1": "Long-press: −1 owned",
  "デッキを見る": "View deck", "カード一覧へ": "Back to cards",
  "右クリックで1枚削除": "Right-click to remove one", "左のカードをクリックして追加": "Click a card on the left to add it",
  "ブーストあり": "Boost: yes", "ブーストなし": "Boost: no", "平均コスト": "Avg. cost",
  "デッキは50枚までです": "A deck can have up to 50 cards", "保存しました": "Saved", "保存できませんでした": "Couldn't save",
  "もう一度押すと確定します": "Press again to confirm",
  "デッキ名": "Deck name", "● 保存していない変更があります": "● Unsaved changes",
  "保存していない変更があります": "You have unsaved changes",
  "このまま移動すると、最後に保存したところまで戻ります。": "If you leave now, the deck goes back to the last time you saved it.",
  "保存して移動": "Save and leave", "保存せずに移動": "Leave without saving", "編集を続ける": "Keep editing",
  "先にデッキを保存してください": "Save the deck first",
  "変更なし": "No changes", "カードごとに見る": "Show each card",
  "ハートが破壊されたとき、このホロビトをコストなしで新しいラインに出すか、オーバービートで使える": "When this card is destroyed from your Heart Zone, you may summon this Horobito onto a new Line or with Overbeat, without paying its cost.",
  "ハートが破壊されたとき、このホロビトをコストなしでオーバービートで使える": "When this card is destroyed from your Heart Zone, you may summon this Horobito with Overbeat without paying its cost.",
  "ハートが破壊されたとき、このカードを墓地に送って3枚引く": "When this card is destroyed from your Heart Zone, put it into your Trash and draw 3 cards.",
  "ハートが破壊されたとき、このカードを見せて手札に加え1枚引く。自分のハートが1枚以下なら、このホロビトをコストなしでオーバービートで使える": "When this card is destroyed from your Heart Zone, reveal it, put it into your hand, and draw 1 card. If you have 1 or fewer Hearts, you may summon this Horobito with Overbeat without paying its cost.",
  // 詳細
  "カードタイプ": "Card type", "コスト / パワー": "Cost / Power", "ブースト": "Boost", "種族": "Tribe", "キーワード能力": "Keyword", "トリガー": "Trigger",
  "レアリティ": "Rarity", "収録先": "Set", "デッキ内": "In deck", "所持": "Owned", "（能力なし）": "(No ability)",
  "所持 +1": "Owned +1", "所持 −1": "Owned −1", "このイラストで追加": "Add this art", "1枚減らす": "Remove one",
  // 書き出し・読込
  "書き出し / 読込": "Export / Import", "コピー": "Copy", "この内容を読み込む": "Import this", "コピーしました": "Copied", "読み込みました": "Imported",
  "「枚数 カード名 [カードID]」形式。IDがなければカード名で照合します（同名が複数あるときは通常レアを優先）。": "Format: \"count name [card ID]\". Without an ID, cards are matched by name (regular rarity first when there are several).",
  "選択しました。Ctrl+Cでコピーしてください": "Selected. Press Ctrl+C to copy", "選択しました。コピーしてください": "Selected. Copy it manually",
  "所持カード 書き出し / 読込": "Collection Export / Import", "この内容で上書き": "Replace with this",
  // 所持カード
  "所持カード": "Collection", "所持カードが未登録です（「所持カード登録」で登録できます）": "No cards registered yet (use the Cards tab)", "所持カードが未登録です": "No cards registered yet",
  // 試しに引く
  "枚数": "Cards", "引き直す": "Redraw", "＋1枚引く": "＋ Draw 1", "山札がありません": "No cards left in the deck", "デッキが空です": "The deck is empty",
  // 対戦記録
  "結果": "Result", "勝ち": "Win", "負け": "Loss", "引き分け": "Draw", "先攻/後攻": "First / Second", "先攻": "First", "後攻": "Second",
  "相手の色": "Opponent's colors", "相手のデッキ": "Opponent's deck", "メモ": "Notes", "日時": "Date", "記録する": "Record",
  "例：青ジャスティス": "e.g. Blue Justice", "例：店舗大会 2回戦、事故った など": "e.g. Store tournament round 2, bad draw",
  "まだ記録がありません": "No matches recorded yet", "勝ち・負け・引き分けを選んでください": "Choose Win, Loss, or Draw", "記録しました": "Recorded",
  "勝": "W", "負": "L", "分": "D",
  // 画像出力
  "まとめる": "Group", "全部並べる": "Show all", "未所持を赤く": "Mark missing", "未所持を赤く：ON": "Mark missing: ON", "画像を保存": "Save image", "閉じる": "Close",
  "作成中…": "Creating…", "画面をタップでボタン表示／スクショして保存": "Tap to show buttons / take a screenshot to save",
  "画像を保存しました": "Image saved", "画像を作れませんでした。スクリーンショットで保存してください": "Couldn't create the image. Please take a screenshot instead", "読み込み中…": "Loading…",
  // QR
  "QRで送る：デッキを選ぶ": "Send via QR: choose decks", "選んだデッキをQRコードにします。受け取った側では、同じデッキは上書き、ないデッキは追加されます。": "Turns the selected decks into a QR code. On the receiving side, the same decks are overwritten and new ones are added.",
  "すべて選択": "Select all", "選択を解除": "Clear selection", "QRコードの容量": "QR code capacity", "送る": "Send", "デッキを選んでください": "Choose decks",
  "容量を超えています。デッキを減らしてください": "Over capacity. Choose fewer decks", "送れるデッキがありません": "No decks to send",
  "データが大きすぎてQRコードにできません": "Too much data for a QR code", "QRコードを作成中…": "Creating QR code…",
  "受け取る側で「QRで受け取る」を開いて、カメラで読み取ってください": "On the other device, open \"Receive via QR\" and scan with the camera",
  "テキストでコピー": "Copy as text", "コピーしました。受け取る側で貼り付けてください": "Copied. Paste it on the other device", "コピーできませんでした": "Couldn't copy",
  "QRコードを作れませんでした。": "Couldn't create the QR code.", "「テキストでコピー」を使ってください。": "Use \"Copy as text\" instead.",
  "カメラを起動中…": "Starting camera…", "読み取り中…": "Scanning…", "カメラを使えません（下の貼り付けを使ってください）": "Camera unavailable (paste the text below instead)",
  "送る側に表示したQRコードを、枠に合わせて映してください。カメラが使えないときは、送る側の「テキストでコピー」の内容をここに貼り付けてください。": "Point the camera at the QR code on the other device so it fits in the frame. If the camera isn't available, paste the text from \"Copy as text\" here.",
  "貼り付けた内容を読み込む": "Import pasted text", "読み込めませんでした。このサイトのQRコードか確認してください": "Couldn't read it. Make sure it's a QR code from this site",
  "受け取った内容": "Received", "上書き": "Overwrite", "追加": "Add", "取り込む": "Import", "やめる": "Cancel", "取り込みました": "Imported",
  "同じデッキは受け取った内容で上書きし、ないデッキは追加します。": "Same decks are overwritten and new decks are added.",
  "所持カードは受け取った内容に置き換わります。": "Your collection will be replaced with the received data.",
  "対戦記録は今ある記録に足し合わせます（同じ記録は1件にまとめます）。": "Match records are merged with existing ones.",
  // イベント
  "イベント検索": "Event search",
  "条件を選んで「公式サイトで検索」を押すと、公式の「ホロビートカードゲーム公認イベント」検索が条件入りで開きます。選んだ条件は次回も残ります。": "Choose conditions and press \"Search on the official site\" to open the official HOROBEAT event search (in Japanese) with those conditions. Your choices are remembered.",
  "※開催内容は変更になる場合があります。参加前に必ずお店に確認してください。": "*Events may change. Always check with the store before attending.",
  "都道府県（複数選択可・地方名を押すとまとめて選択）": "Prefectures (multiple OK; tap a region name to select all in it)",
  "開催日": "Date", "開始時間（この時間以降）": "Start time (at or after)", "参加制限": "Eligibility",
  "すべての参加制限": "Any", "小学6年生以下": "Elementary school (grade 6) and below", "年齢制限なし": "No age limit",
  "キーワード（店舗名など）": "Keyword (store name, etc.)", "例：TSUTAYA": "e.g. TSUTAYA", "公式サイトで検索 ↗": "Search on the official site ↗",
  "公式のイベント一覧（大会・体験会のお知らせ）↗": "Official event list (tournaments, trial events) ↗", "公認イベント検索（条件なし）↗": "Official event search (no conditions) ↗",
  "今日": "Today", "明日": "Tomorrow", "今週末": "This weekend", "来週末": "Next weekend", "今日から1週間": "Next 7 days", "指定なし": "Any",
  "全国": "All of Japan", "日付指定なし": "Any date",
  "北海道・東北": "Hokkaido / Tohoku", "関東": "Kanto", "中部": "Chubu", "近畿": "Kinki", "中国・四国": "Chugoku / Shikoku", "九州・沖縄": "Kyushu / Okinawa",
  "北海道":"Hokkaido","青森":"Aomori","岩手":"Iwate","宮城":"Miyagi","秋田":"Akita","山形":"Yamagata","福島":"Fukushima","茨城":"Ibaraki","栃木":"Tochigi","群馬":"Gunma",
  "埼玉":"Saitama","千葉":"Chiba","東京":"Tokyo","神奈川":"Kanagawa","新潟":"Niigata","富山":"Toyama","石川":"Ishikawa","福井":"Fukui","山梨":"Yamanashi","長野":"Nagano",
  "岐阜":"Gifu","静岡":"Shizuoka","愛知":"Aichi","三重":"Mie","滋賀":"Shiga","京都":"Kyoto","大阪":"Osaka","兵庫":"Hyogo","奈良":"Nara","和歌山":"Wakayama",
  "鳥取":"Tottori","島根":"Shimane","岡山":"Okayama","広島":"Hiroshima","山口":"Yamaguchi","徳島":"Tokushima","香川":"Kagawa","愛媛":"Ehime","高知":"Kochi",
  "福岡":"Fukuoka","佐賀":"Saga","長崎":"Nagasaki","熊本":"Kumamoto","大分":"Oita","宮崎":"Miyazaki","鹿児島":"Kagoshima","沖縄":"Okinawa",
  // 設定
  "言語": "Language", "用語集": "Glossary", "日本語": "日本語", "注意": "Notice",
  "用語集（非公式）": "Glossary (unofficial)",
  "タップで開く": "Tap to open", "タップで閉じる": "Tap to close",
  "カードの効果は日本語のままです。この用語集を見ながら読んでください。": "Card effects are still in Japanese. Use this glossary to read them.",
  "カード画像・カード情報の権利はタカラトミーにあります。非公式のファンツールです。": "Card images and card information are the property of TOMY Company, Ltd. This is an unofficial fan-made tool.",
  "英語訳はすべて非公式です。": "All English translations are unofficial.",
  "バージョン": "Version",
};
// 用語集の見出しも
GLOSSARY.forEach(([ja, en, rows]) => { if (!(ja in EN)) EN[ja] = en; rows.forEach(([j, e]) => { if (!(j in EN)) EN[j] = e; }); });
// 種族名
GLOSSARY[5][2].forEach(([j, e]) => EN[j] = e);
// 収録先（絞り込みの選択肢など、単独で出るとき）
Object.entries(SETS_EN).forEach(([j, e]) => EN[j] = `${j} / ${e}`);

// ---- 数字などを含む文言 ----
const P = [
  [/^(\d+) 件表示（全(\d+)種）$/, "$1 shown (of $2)"],
  [/^所持 (\d+)\/(\d+)種 ・ 4枚そろい (\d+)種 ・ 計(\d+)枚$/, "Owned $1/$2 · complete sets $3 · $4 cards total"],
  [/^所持(\d+)$/, "Own $1"],
  [/^(\d+)種$/, "$1 kinds"],
  [/^(\d+)枚$/, "$1 cards"],
  [/^(\d+)枚 → (\d+)枚$/, "$1 → $2 cards"],
  [/^＋(\d+)枚$/, "+$1 cards"],
  [/^−(\d+)枚$/, "−$1 cards"],
  [/^(\d+)種が変わる$/, "$1 kinds change"],
  [/^対戦記録 ＋(\d+)件$/, "Match records +$1"],
  [/^(\d+)\/(\d+)枚$/, "$1/$2 cards"],
  [/^(\d+) \/ (\d+)件$/, "$1 / $2"],
  [/^(\d+)枚（同名合計 (\d+)\/4）$/, "$1 (same name total $2/4)"],
  [/^(\d+)枚（同名合計 (\d+)枚）$/, "$1 (same name total $2)"],
  [/^「(.+)」は4枚までです$/, "Max 4 copies of \"$1\""],
  [/^✓ 保存済み（(.+)）・変更は自動保存されます$/, "✓ Saved ($1) · changes are saved automatically"],
  [/^✓ 保存済み（(.+)）$/, "✓ Saved ($1)"],
  [/^保存しました（現在(\d+)枚）$/, "Saved ($1 cards)"],
  [/^読み込みました（(\d+)(?:行|件)は認識できませんでした）$/, "Imported ($1 lines not recognized)"],
  [/^(\d+)勝(\d+)敗(?:(\d+)分)?$/, (m, w, l, d) => `${w}W ${l}L${d ? ` ${d}D` : ""}`],
  [/^勝率$/, "Win rate"],
  [/^(\d+)戦 ・ 勝率 (.+)$/, "$1 games · win rate $2"],
  [/^対戦記録：(.+)$/, "Match log: $1"],
  [/^vs$/, "vs"],
  [/^(.+) のコピー$/, "$1 (copy)"],
  [/^(\d+)個を送る$/, "Send $1"],
  [/^デッキ(\d+)個$/, "$1 decks"],
  [/^(.+)・(\d+)文字$/, "$1 · $2 characters"],
  [/^(\d+)枚・記録(\d+)件$/, "$1 cards · $2 records"],
  [/^PCとスマホで所持データを移すときに使います（(\d+)文字）。「この内容で上書き」で今の所持データが置き換わります。$/, "Use this to move your collection between PC and phone ($1 characters). \"Replace with this\" overwrites your current collection."],
  [/^×(\d+)（不足(\d+)）$/, "×$1 (missing $2)"],
  [/^未所持を赤く：ON（不足(\d+)枚）$/, "Mark missing: ON ($1 missing)"],
  [/^保存しました（(\d+)枚の画像を読み込めませんでした）$/, "Saved ($1 images couldn't be loaded)"],
  [/^(.+)ほか(\d+)件$/, "$1 and $2 more"],
  [/^(\d+):(\d+)以降$/, "from $1:$2"],
  [/^「(.+)」$/, "\"$1\""],
];
const JP = /[぀-ヿ一-鿿]/;
function tr(s){
  if (lang !== "en" || !s || !JP.test(s)) return s;
  const lead = s.match(/^\s*/)[0], tail = s.match(/\s*$/)[0], core = s.trim();
  if (core in EN) return lead + EN[core] + tail;
  for (const [re, rep] of P) if (re.test(core)) return lead + core.replace(re, rep) + tail;
  // 「 ／ 」でつながった文言は、部分ごとに置き換える
  if (core.includes(" ／ ")) return lead + core.split(" ／ ").map(x => tr(x)).join(" / ") + tail;
  return s;
}
window.t = tr;

if (lang !== "en") return;
// ---- 画面の文言を置き換える ----
const ATTRS = ["placeholder", "title", "aria-label"];
function skip(n){ const el = n.nodeType === 1 ? n : n.parentElement; return !el || el.closest(".notr, script, style, textarea"); }
function walk(root){
  if (root.nodeType === 3) { if (!skip(root)) { const v = tr(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; } return; }
  if (root.nodeType !== 1 || skip(root)) return;
  ATTRS.forEach(a => { if (root.hasAttribute(a)) { const v = tr(root.getAttribute(a)); if (v !== root.getAttribute(a)) root.setAttribute(a, v); } });
  const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n; while ((n = it.nextNode())) {
    if (n.nodeType === 1) { if (n.closest(".notr")) continue; ATTRS.forEach(a => { if (n.hasAttribute(a)) { const v = tr(n.getAttribute(a)); if (v !== n.getAttribute(a)) n.setAttribute(a, v); } }); }
    else if (!skip(n)) { const v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  }
}
window.i18nWalk = walk;
const start = () => {
  document.title = "HOROBEAT Fan Tools";
  walk(document.body);
  new MutationObserver(ms => ms.forEach(m => {
    if (m.type === "characterData") walk(m.target);
    else if (m.type === "attributes") walk(m.target);
    else m.addedNodes.forEach(walk);
  })).observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:ATTRS});
};
if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
