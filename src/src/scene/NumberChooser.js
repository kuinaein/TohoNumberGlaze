import {NumberPlaceSquare} from '@/scene/NumberPlaceSquare';

// eslint-disable-next-line no-unused-vars
const unused = NumberPlaceSquare;

/** @class */
export class NumberChooser {
  /**
   * @param {number} baseLength 基準長=マス目の幅
   */
  constructor(baseLength) {
    this.baseLength = baseLength;
    this.radius = baseLength * 0.4;
    /** @type {NumberPlaceSquare|null} */
    this.target = null;

    const baseNode = new cc.Node();
    baseNode.setPosition(cc.p(0, 0));
    baseNode.setVisible(false);

    for (let i = 0; i < 9; ++i) {
      const choice = new cc.DrawNode();
      choice.drawDot(cc.p(0, 0), this.radius, cc.color(255, 255, 255, 192));
      choice.setPosition(
          cc.p(
              this.radius * 2.5 * Math.sin((Math.PI * 2 * i) / 9),
              this.radius * 2.5 * Math.cos((Math.PI * 2 * i) / 9)
          )
      );
      baseNode.addChild(choice);

      const letter = new cc.LabelTTF(i + 1, 'sans-serif', this.radius * 1.5);
      letter.setFontFillColor(cc.color.BLACK);
      choice.addChild(letter);
    }

    this.baseNode = baseNode;
  }

  /**
   * @return {cc.Node}
   */
  getNode() {
    return this.baseNode;
  }

  /**
   * @return {boolean}
   */
  isVisible() {
    return this.getNode().isVisible();
  }

  /**
   * @param {NumberPlaceSquare} target
   */
  show(target) {
    this.target = target;
    const node = this.getNode();
    const box = target.getNode().getBoundingBoxToWorld();
    node.setPosition(box.x + box.width / 2, box.y + box.height / 2);
    node.setVisible(true);
  }

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   */
  handleOnTouch(touch, event) {
    const node = this.getNode();

    let nearest = -1;
    let nearestDist = Number.POSITIVE_INFINITY;
    const choices = node.getChildren();
    for (let i = 0; i < choices.length; ++i) {
      const dist = cc.pDistance(
          choices[i].convertTouchToNodeSpace(touch),
          cc.p(0, 0)
      );
      // 半径の1.5倍程度までは許容する
      if (this.radius * 1.5 > dist && nearestDist > dist) {
        nearestDist = dist;
        nearest = i;
      }
    }

    if (-1 !== nearest) {
      this.target.setValue(1 + nearest);
    }

    this.target = null;
    node.setVisible(false);
  }
}
