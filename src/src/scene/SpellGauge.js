import {AppConstants} from '@/core/constants';
import {RESOURCE_MAP} from '@/resource';

/** @class */
export class SpellGauge {
  /** @constructor */
  constructor() {
    this.point = 0;

    const spellGauge = new cc.Sprite(RESOURCE_MAP.Spell_Gauge_png);
    spellGauge.setAnchorPoint(1, 0);
    spellGauge.setPosition(cc.winSize.width * 0.95, cc.winSize.height * 0.05);
    spellGauge.setScaleY(0.45);

    const spellGaugeFull = new cc.Sprite(RESOURCE_MAP.Spell_Gauge_Full_png);
    spellGaugeFull.setAnchorPoint(0, 0);
    spellGauge.addChild(spellGaugeFull);

    this.node = spellGauge;
    this.spellGaugeFull = spellGaugeFull;
    this.updateGauge(0);
  }

  /** @return {cc.Sprite} */
  getNode() {
    return this.node;
  }

  /** @return {number} */
  getPoint() {
    return this.point;
  }

  /**
   * @param {number} diff 何ポイント変化させるか
   */
  updateGauge(diff) {
    this.point = Math.max(
        Math.min(this.point + diff, AppConstants.SPELL_GAUGE_MAX),
        0
    );
    const spellGaugeBox = this.getNode().getTextureRect();
    const spellGaugeCurrent =
      (spellGaugeBox.height * (AppConstants.SPELL_GAUGE_MAX - this.point)) /
      AppConstants.SPELL_GAUGE_MAX;
    this.spellGaugeFull.setTextureRect(
        cc.rect(
            0,
            spellGaugeCurrent,
            spellGaugeBox.width,
            spellGaugeBox.height - spellGaugeCurrent
        )
    );
  }
}
