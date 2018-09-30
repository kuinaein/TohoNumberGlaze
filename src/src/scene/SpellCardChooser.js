import {createBgLayer} from '@/util/cocos2d-util';
import {SpellCard} from '@/character/SpellCard';

// eslint-disable-next-line no-unused-vars
const unused = SpellCard;

/** @class */
export class SpellCardChooser {
  /**
   * @param {SpellCard[]} spellCards
   */
  constructor(spellCards) {
    this.spellCards = spellCards;

    const spellCard1 = new cc.LabelTTF(
        `${spellCards[0].getConsumptionRatio()}%:${spellCards[0].getName()}`,
        'sans-serif',
        cc.winSize.height * 0.05
    );
    spellCard1.setFontFillColor(cc.color.BLACK);
    const spellCard1Bg = createBgLayer(spellCard1, cc.color(255, 192, 0));
    spellCard1Bg.setAnchorPoint(0, 1);
    spellCard1Bg.setPosition(cc.winSize.width * 0.55, cc.winSize.height * 0.3);

    this.node = spellCard1Bg;
  }

  /** @return {cc.Node} */
  getNode() {
    return this.node;
  }

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {SpellCard|null} 選択されたスペカ
   */
  handleOnTouch(touch, event) {
    if (
      cc.rectContainsPoint(
          this.getNode().getBoundingBoxToWorld(),
          touch.getLocation()
      )
    ) {
      return this.spellCards[0];
    }
    return null;
  }
}
