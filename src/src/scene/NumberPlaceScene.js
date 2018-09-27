import {createSimpleScene} from '@/util/cocos2d-util';
import {NumberPlaceModel} from '@/scene/NumberPlaceModel';
import {NumberPlaceSquare} from '@/scene/NumberPlaceSquare';
import {NumberChooser} from '@/scene/NumberChooser';

/**
 * @typedef NumberPlaceLayerProps
 * @property {NumberPlaceModel} model
 * @property {NumberPlaceSquare[][]} squares
 * @property {NumberChooser} chooser
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
      squares.push(row);
    }
    this.squares = squares;

    this.chooser = new NumberChooser(
        this.squares[0][0].getNode().getBoundingBoxToWorld().width
    );
    this.addChild(this.chooser.getNode());

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
      // onTouchEnded: this.onTouchEnded.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);
  },

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {boolean}
   */
  onTouchBegan(touch, event) {
    if (this.chooser.isVisible()) {
      this.chooser.handleOnTouch(touch, event);
    } else {
      SQ_LOOP: for (const row of this.squares) {
        for (const sq of row) {
          const box = sq.getNode().getBoundingBoxToWorld();
          const pt = touch.getLocation();
          if (cc.rectContainsPoint(box, pt)) {
            if (sq.isFixed()) {
              console.error('変更できないよ！'); // FIXME
            } else {
              this.chooser.show(sq);
            }
            break SQ_LOOP;
          }
        }
      }
    }
    return false;
  },
};

export const NumberPlaceScene = createSimpleScene(numberPlaceLayerProps);
