# Ren_AutoStateByParam_LTE_GTE.js

このプラグインは、<br>
HP/MP/TPに応じて自動的にステート付与するRPGツクールMZ版プラグインです。<br>
ステートのメモ欄に以下のように記述すると、<br>
該当するHP/MP/TPが**条件を満たした時**に、自動で**ステートが付与**されます。<br>
（数値・％対応）<br>

---

## 🖊️ ステートのメモ欄の書き方（例）

- HPが最大HPの50%以上なら付与
```
<autoAddByHpGTE:50%>
```
- HPが500以下なら付与
```
<autoAddByHpLTE:500>
```
- MPが30以上なら付与
```
<autoAddByMpGTE:30>
```
- MPが最大MPの10%以下なら付与
```
<autoAddByMpLTE:10%>
```
- TPが最大TPの20%以上なら付与
```
<autoAddByTpGTE:20%>
```
- TPが10以下なら付与
```
<autoAddByTpLTE:10>
```
※ %表記（割合）と数字（実数）は**どちらでもOK**。<br>
※ 各ステートに指定できる条件タグは**1種類のみ**。(併記非対応)

---

## 📜 利用規約

このプラグインは **MITライセンス** に基づいて配布されています。<br>
商用・非商用問わず、改変・再配布・組み込みすべて自由です。

---

## 👤 クレジット

- **作者：RenTokimiya + ChatGPT (Support)** <br>
- 参考プラグイン：**DarkPlasma**様 <br>
  https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_RemoveStateByMp.js

ご自由にお使いください！
