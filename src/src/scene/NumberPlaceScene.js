import {createSimpleScene} from '@/util/cocos2d-util';
import {NumberPlaceModel} from '@/scene/NumberPlaceModel';
import {NumberPlaceSquare} from '@/scene/NumberPlaceSquare';

/**
 * @typedef NumberPlaceLayerProps
 * @property {NumberPlaceModel} model
 * @property {NumberPlaceSquare[][]} squares
 */

/** @type {cc.Layer & NumberPlaceLayerProps} */
const numberPlaceLayerProps = {
  ctor() {
    this._super();

    this.model = new NumberPlaceModel('easy'); // FIXME
    this.model.printBoard();

    /** @type {NumberPlaceSquare[][]} */
    const squares = [];
    for (let r = 0; r < 9; ++r) {
      const row = [];
      for (let c = 0; c < 9; ++c) {
        const sq = new NumberPlaceSquare(this.model, r, c);
        this.addChild(sq.getNode());
        row.push(sq);
      }
      squares.push[row];
    }
    this.squares = squares;
  },
};

export const NumberPlaceScene = createSimpleScene(numberPlaceLayerProps);
