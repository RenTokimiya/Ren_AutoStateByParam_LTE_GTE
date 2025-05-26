//=============================================================================
// Ren_AutoStateByParam_LTE_GTE.js
// ----------------------------------------------------------------------------
// Copyright (c) 2025 RenTokimiya
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0 2025/05/18 初版
// ----------------------------------------------------------------------------
// [X(Twitter)]: https://x.com/StargazerNova1/
//=============================================================================

/*:
 * @target MZ
 * @plugindesc HP/MP/TPに応じて自動的にステート付与します（数値・％対応）
 * @author RenTokimiya + ChatGPT(Support)
 * @url https://github.com/RenTokimiya
 * @help Ren_AutoStateByParam_LTE_GTE.js
 *
 * ステートのメモ欄に以下のように記述すると、
 * 該当するHP/MP/TPが条件を満たした時に、自動でステートが付与されます。
 *
 * ［使い方例］
 * <autoAddByHpGTE:50%>    // HPが最大HPの50%以上なら付与
 * <autoAddByHpLTE:500>    // HPが500以下なら付与
 * <autoAddByMpGTE:30>     // MPが30以上なら付与
 * <autoAddByMpLTE:10%>    // MPが最大MPの10%以下なら付与
 * <autoAddByTpGTE:20%>    // TPが最大TPの20%以上なら付与
 * <autoAddByTpLTE:10>     // TPが10以下なら付与
 *
 * ※ %表記（割合）と数字（実数）はどちらでもOK。
 * ※ 各ステートに指定できる条件タグは1種類のみ。(併記非対応)
 *
 * 制作にあたり、DarkPlasma様のプラグインを参考にさせていただきました。
 * https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_RemoveStateByMp.js
 *
 * ［利用規約］
 * このプラグインはMITライセンスで配布しています。
 */

(() => {
  'use strict';

  const TAGS = [
    { tag: 'autoAddByHpLTE', param: 'hp', op: 'lte' },
    { tag: 'autoAddByHpGTE', param: 'hp', op: 'gte' },
    { tag: 'autoAddByMpLTE', param: 'mp', op: 'lte' },
    { tag: 'autoAddByMpGTE', param: 'mp', op: 'gte' },
    { tag: 'autoAddByTpLTE', param: 'tp', op: 'lte' },
    { tag: 'autoAddByTpGTE', param: 'tp', op: 'gte' },
  ];

  function parseThreshold(metaTag, value, max) {
    if (!value) return null;
    const str = String(value).trim();
    if (str.endsWith('%')) {
      const ratio = parseFloat(str.slice(0, -1));
      if (!isNaN(ratio)) return Math.floor(max * ratio / 100);
    } else {
      const num = parseInt(str);
      if (!isNaN(num)) return num;
    }
    return null;
  }

  function getCurrentValue(battler, param) {
    switch (param) {
      case 'hp': return battler.hp;
      case 'mp': return battler.mp;
      case 'tp': return battler.tp;
    }
    return 0;
  }

  function getMaxValue(battler, param) {
    switch (param) {
      case 'hp': return battler.mhp;
      case 'mp': return battler.mmp;
      case 'tp': return battler.maxTp ? battler.maxTp() : 100;
    }
    return 1;
  }

  function Game_Battler_AutoStateByParamMixIn(gameBattler) {
    gameBattler.checkAutoStateByParam = function () {
      const statesToAdd = $dataStates.filter(state => {
        if (!state || !state.meta) return false;
        for (const tagDef of TAGS) {
          const rawValue = state.meta[tagDef.tag];
          const threshold = parseThreshold(tagDef.tag, rawValue, getMaxValue(this, tagDef.param));
          if (threshold === null) continue;

          const current = getCurrentValue(this, tagDef.param);
          if (tagDef.op === 'lte' && current <= threshold && !this.isStateAffected(state.id)) return true;
          if (tagDef.op === 'gte' && current >= threshold && !this.isStateAffected(state.id)) return true;
        }
        return false;
      });

      const statesToRemove = this.states().filter(state => {
        if (!state || !state.meta) return false;
        for (const tagDef of TAGS) {
          const rawValue = state.meta[tagDef.tag];
          const threshold = parseThreshold(tagDef.tag, rawValue, getMaxValue(this, tagDef.param));
          if (threshold === null) continue;

          const current = getCurrentValue(this, tagDef.param);
          if (tagDef.op === 'lte' && current > threshold) return true;
          if (tagDef.op === 'gte' && current < threshold) return true;
        }
        return false;
      });

      statesToAdd.forEach(state => this.addState(state.id));
      statesToRemove.forEach(state => this.removeState(state.id));
    };

    const _refresh = gameBattler.refresh;
    gameBattler.refresh = function () {
      _refresh.call(this);
      this.checkAutoStateByParam();
    };

    const _gainHp = gameBattler.gainHp;
    gameBattler.gainHp = function (value) {
      _gainHp.call(this, value);
      this.checkAutoStateByParam();
    };

    const _gainMp = gameBattler.gainMp;
    gameBattler.gainMp = function (value) {
      _gainMp.call(this, value);
      this.checkAutoStateByParam();
    };

    const _gainTp = gameBattler.gainTp;
    gameBattler.gainTp = function (value) {
      _gainTp.call(this, value);
      this.checkAutoStateByParam();
    };

    const _setHp = gameBattler.setHp;
    gameBattler.setHp = function (value) {
      _setHp.call(this, value);
      this.checkAutoStateByParam();
    };

    const _setMp = gameBattler.setMp;
    gameBattler.setMp = function (value) {
      _setMp.call(this, value);
      this.checkAutoStateByParam();
    };

    const _setTp = gameBattler.setTp;
    gameBattler.setTp = function (value) {
      _setTp.call(this, value);
      this.checkAutoStateByParam();
    };
  }

  Game_Battler_AutoStateByParamMixIn(Game_Battler.prototype);
})();
