import {createSimpleScene} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';

import {NumberPlaceModel} from '@/scene/NumberPlaceModel';
import {NumberPlaceSquare} from '@/scene/NumberPlaceSquare';
import {NumberChooser} from '@/scene/NumberChooser';

const NumberPlaceMode = {
  PLAYING_IDLE: 'PLAYING_IDLE',
  PLAYING_BUSY: 'PLAYING_BUSY',
  STAGE_END: 'STAGE_END',
};

/**
 * @typedef NumberPlaceLayerProps
 * @property {string} mode
 * @property {NumberPlaceModel} model
 * @property {NumberPlaceSquare[][]} squares
 * @property {NumberChooser} chooser
 * @property {sp.SkeletonAnimation} playerCharacter
 */

/** @type {cc.Layer & NumberPlaceLayerProps} */
const numberPlaceLayerProps = {
  ctor() {
    this._super();

    this.mode = NumberPlaceMode.PLAYING_IDLE;
    this.model = new NumberPlaceModel('easy'); // FIXME
    this.initSquares();

    const playerCharacter = new sp.SkeletonAnimation(
        RESOURCE_MAP.SD_Chillno_json,
        RESOURCE_MAP.SD_Chillno_atlas,
        0.2
    );
    playerCharacter.setPosition(
        cc.winSize.width * 0.8,
        cc.winSize.height * 0.3
    );
    playerCharacter.setAnimation(0, 'float', true);
    this.addChild(playerCharacter);
    this.playerCharacter = playerCharacter;

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);

    this.scheduleUpdate();
  },

  initSquares() {
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
  },

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {boolean}
   */
  onTouchBegan(touch, event) {
    if (NumberPlaceMode.PLAYING_IDLE !== this.mode) {
      return false;
    }

    if (this.chooser.isVisible()) {
      const opSuccess = this.chooser.handleOnTouch(touch, event);
      if (!opSuccess) {
        this.rockLayer();
      } else if (this.model.isSolved()) {
        this.onSolved();
      }
    } else {
      this.showChooser(touch);
    }
    return false;
  },

  /**
   * @param {cc.Touch} touch
   */
  showChooser(touch) {
    for (const row of this.squares) {
      for (const sq of row) {
        const box = sq.getNode().getBoundingBoxToWorld();
        const pt = touch.getLocation();
        if (cc.rectContainsPoint(box, pt)) {
          if (sq.isFixed()) {
            this.rockLayer();
          } else {
            this.chooser.show(sq);
          }
          return;
        }
      }
    }
  },

  onSolved() {
    this.mode = NumberPlaceMode.STAGE_END;

    const congrats = new cc.LabelTTF(
        'CLEAR!!',
        'sans-serif',
        cc.winSize.height * 0.2
    );

    const box = congrats.getContentSize();
    const congratsBg = new cc.LayerColor(
        cc.color(0, 0, 0, 192),
        box.width * 1.2,
        box.height
    );
    congratsBg.ignoreAnchorPointForPosition(false);
    congratsBg.setAnchorPoint(0.5, 0.5);
    congratsBg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    this.addChild(congratsBg);

    const bgBox = congratsBg.getContentSize();
    congrats.setPosition(bgBox.width / 2, bgBox.height / 2);
    congratsBg.addChild(congrats);
  },

  /** 画面を揺らす */
  rockLayer() {
    // TODO 効果音入れる
    this.mode = NumberPlaceMode.PLAYING_BUSY;
    const dist = cc.winSize.width * 0.01;
    this.runAction(
        cc.sequence([
          cc.moveTo(0.05, cc.p(-dist, 0)),
          cc.moveTo(0.05, cc.p(dist, 0)),
          cc.moveTo(0.05, cc.p(0, 0)),
          cc.callFunc(() => {
            this.mode = NumberPlaceMode.PLAYING_IDLE;
          }),
        ])
    );
  },
};

export const NumberPlaceScene = createSimpleScene(numberPlaceLayerProps);
