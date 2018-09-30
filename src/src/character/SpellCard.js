import {AppConstants} from '@/core/constants';

/** @class */
export class SpellCard {
  /**
   * @param {string} name
   * @param {nunber} consumptionRatio 宣言に必要なゲージの割合. 実際の消費値はこの3/10になる.
   */
  constructor(name, consumptionRatio) {
    this.name = name;
    this.consumptionRatio = consumptionRatio;
  }

  /** @return {string} */
  getName() {
    return this.name;
  }

  /** @return {number} */
  getConsumptionRatio() {
    return this.consumptionRatio;
  }

  /** @return {number} */
  getConsumption() {
    return (this.consumptionRatio * AppConstants.SPELL_GAUGE_MAX) / 100;
  }
}

/** @class */
export class Maru9 extends SpellCard {
  /** @constructor */
  constructor() {
    super(' (9) バカ', 10);
  }
}
