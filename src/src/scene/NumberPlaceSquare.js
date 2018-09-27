import {NumberPlaceModel} from '@/scene/NumberPlaceModel';

// eslint-disable-next-line no-unused-vars
const unused = NumberPlaceModel;

/**
 * マス目一個分のデータ
 *
 * @class
 */
export class NumberPlaceSquare {
  /**
   * @param {NumberPlaceModel} model
   * @param {number} rowIndex
   * @param {number} colIndex
   */
  constructor(model, rowIndex, colIndex) {
    this.model = model;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;

    const node = this.createSquareBg();
    const length = node.getContentSize().height;
    const letter = new cc.LabelTTF(
        model.get(rowIndex, colIndex),
        'sans-serif',
        length * 0.5
    );
    letter.setFontFillColor(
      model.isFixed(rowIndex, colIndex) ? cc.color.RED : cc.color.BLACK
    );
    letter.setAnchorPoint(cc.p(0.5, 0.5));
    letter.setPosition(length / 2, length / 2);
    node.addChild(letter);

    this.letter = letter;
  }

  /**
   * @return {cc.Node}
   */
  getNode() {
    return this.letter.getParent();
  }

  /**
   * @return {boolean}
   */
  isFixed() {
    return this.model.isFixed(this.rowIndex, this.colIndex);
  }

  /**
   * @param {number|null} value
   */
  setValue(value) {
    this.model.set(this.rowIndex, this.colIndex, value);
    this.letter.setString(value ? value : '');
  }

  /**
   * @return {cc.Node}
   */
  createSquareBg() {
    const length = cc.winSize.height * 0.09;

    const sqBg = new cc.DrawNode();
    sqBg.setContentSize(cc.size(length, length));
    sqBg.drawRect(
        cc.p(0, 0),
        cc.p(length, length),
        cc.color(220, 211, 178),
        length * 0.05,
        cc.color.GRAY
    );
    if (0 !== this.rowIndex && 0 === this.rowIndex % 3) {
      sqBg.drawSegment(
          cc.p(0, length),
          cc.p(length, length),
          length * 0.05,
          cc.color.BLACK
      );
    }
    if (0 !== this.colIndex && 0 === this.colIndex % 3) {
      sqBg.drawSegment(
          cc.p(0, 0),
          cc.p(0, length),
          length * 0.05,
          cc.color.BLACK
      );
    }

    sqBg.ignoreAnchorPointForPosition(false);
    sqBg.setAnchorPoint(cc.p(0, 1));
    sqBg.setPosition(
        cc.p(
            cc.winSize.width * 0.05 + length * this.colIndex,
            cc.winSize.height * 0.9 - length * this.rowIndex
        )
    );
    return sqBg;
  }
}
