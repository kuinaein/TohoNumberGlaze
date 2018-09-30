import MersenneTwister from 'mersenne-twister';
import {createSimpleScene, createBgLayer} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';

import {NumberPlaceModel} from '@/scene/NumberPlaceModel';
import {NumberPlaceSquare} from '@/scene/NumberPlaceSquare';
import {NumberChooser} from '@/scene/NumberChooser';
import {SpellCardChooser} from '@/scene/SpellCardChooser';
import {sudoku} from '@/lib/sudoku/sudoku';

const BOARD_WIDTH = 9;
const BOARD_AREA = BOARD_WIDTH * BOARD_WIDTH;

const NumberPlaceMode = {
  PLAYING_IDLE: 'PLAYING_IDLE',
  PLAYING_BUSY: 'PLAYING_BUSY',
  STAGE_END: 'STAGE_END',
};

/**
 * @typedef NumberPlaceLayerProps
 * @property {MersenneTwister} mt
 * @property {string} mode
 * @property {NumberPlaceModel} model
 * @property {NumberPlaceSquare[][]} squares
 * @property {NumberChooser} numberChooser
 * @property {SpellCardChooser} spellCardChooser
 * @property {sp.SkeletonAnimation} playerCharacter
 */

/** @type {cc.Layer & NumberPlaceLayerProps} */
const numberPlaceLayerProps = {
  ctor() {
    this._super();
    this.mt = new MersenneTwister();

    this.mode = NumberPlaceMode.PLAYING_IDLE;
    this.model = new NumberPlaceModel('easy'); // FIXME
    this.initPlayerCharacter();
    this.spellCardChooser = new SpellCardChooser();
    this.addChild(this.spellCardChooser.getNode());
    this.initSquares();

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);
  },

  initSquares() {
    /** @type {NumberPlaceSquare[][]} */
    const squares = [];
    for (let r = 0; r < BOARD_WIDTH; ++r) {
      const row = [];
      for (let c = 0; c < BOARD_WIDTH; ++c) {
        const sq = new NumberPlaceSquare(this.model, r, c);
        this.addChild(sq.getNode());
        row.push(sq);
      }
      squares.push(row);
    }
    this.squares = squares;

    this.numberChooser = new NumberChooser(
        this.squares[0][0].getNode().getBoundingBoxToWorld().width
    );
    this.addChild(this.numberChooser.getNode());
  },

  initPlayerCharacter() {
    const playerCharacter = new sp.SkeletonAnimation(
        RESOURCE_MAP.SD_Chillno_json,
        RESOURCE_MAP.SD_Chillno_atlas,
        0.2
    );
    playerCharacter.setPosition(
        cc.winSize.width * 0.65,
        cc.winSize.height * 0.7
    );
    playerCharacter.setAnimation(0, 'float', true);
    this.addChild(playerCharacter);
    playerCharacter.setDebugBonesEnabled('production' !== process.env.NODE_ENV);
    playerCharacter.setDebugSlotsEnabled('production' !== process.env.NODE_ENV);
    this.playerCharacter = playerCharacter;
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
    this.mode = NumberPlaceMode.PLAYING_BUSY;

    if (this.numberChooser.isVisible()) {
      const opSuccess = this.numberChooser.handleOnTouch(touch, event);
      if (!opSuccess) {
        this.rockLayer();
      } else if (this.model.isSolved()) {
        this.onSolved();
      }
      this.mode = NumberPlaceMode.PLAYING_IDLE;
      return false;
    }

    if (this.showNumberChooser(touch)) {
      this.mode = NumberPlaceMode.PLAYING_IDLE;
      return false;
    }
    const spellCard = this.spellCardChooser.handleOnTouch(touch, event);
    if (spellCard) {
      this.castSpell();
      return false;
    }

    this.mode = NumberPlaceMode.PLAYING_IDLE;
    return false;
  },

  /**
   * @param {cc.Touch} touch
   * @return {boolean} どれかのマスに対し選択肢を表示したかどうか. 即ちこのメソッドで処理が終わる場合true
   */
  showNumberChooser(touch) {
    for (const row of this.squares) {
      for (const sq of row) {
        const box = sq.getNode().getBoundingBoxToWorld();
        const pt = touch.getLocation();
        if (cc.rectContainsPoint(box, pt)) {
          if (sq.isFixed()) {
            this.rockLayer();
          } else {
            this.numberChooser.show(sq);
          }
          return true;
        }
      }
    }
    return false;
  },

  onSolved() {
    this.mode = NumberPlaceMode.STAGE_END;
    const congrats = new cc.LabelTTF(
        'CLEAR!!',
        'sans-serif',
        cc.winSize.height * 0.2
    );
    const congratsBg = createBgLayer(congrats, cc.color(0, 0, 0, 192));
    congratsBg.ignoreAnchorPointForPosition(false);
    congratsBg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    this.addChild(congratsBg);
  },

  castSpell() {
    const board = this.model.getCurrentBoard();
    const numNines = board.replace(/[^9]/g, '').length;
    if (BOARD_WIDTH === numNines) {
      this.rockLayer();
      this.mode = NumberPlaceMode.PLAYING_IDLE;
      return;
    }

    const candidates = sudoku.get_candidates(board);
    const start = this.mt.random_int() % BOARD_AREA;
    for (let i = 0; i < BOARD_AREA; ++i) {
      const r = Math.floor(((start + i) % BOARD_AREA) / BOARD_WIDTH);
      const c = (start + i) % BOARD_WIDTH;
      const cand = candidates[r][c];
      if (0 <= cand.indexOf('9')) {
        const sq = this.squares[r][c];
        if (null === sq.getValue()) {
          sq.setValue(9);
          break;
        }
      }
    }

    this.showCutin();
  },

  showCutin() {
    this.playerCharacter.setAnimation(0, 'spell', false);

    const spellCardLabel = new cc.LabelTTF(
        '(9)バカ',
        'sans-serif',
        cc.winSize.height * 0.05
    );
    spellCardLabel.setOpacity(0);
    spellCardLabel.runAction(cc.sequence([cc.fadeIn(0.5), cc.fadeOut(1)]));

    const spellCardLabelBg = createBgLayer(
        spellCardLabel,
        cc.color(0, 0, 0, 128)
    );
    spellCardLabelBg.setAnchorPoint(0, 1);
    spellCardLabelBg.setPosition(
        cc.winSize.width * 0.55,
        cc.winSize.height * 0.9
    );
    this.addChild(spellCardLabelBg);

    const cutin = new cc.Sprite(RESOURCE_MAP.Cutin_Chillno_png);
    cutin.setPosition(cc.winSize.width * 0.75, 0);
    cutin.setScale(0.25);
    cutin.setOpacity(0);
    cutin.runAction(
        cc.sequence([
          cc.spawn([cc.moveBy(0.5, 0, cc.winSize.height * 0.4), cc.fadeIn(0.5)]),
          cc.callFunc(() => {
            this.playerCharacter.setAnimation(0, 'float', true);
            this.mode = NumberPlaceMode.PLAYING_IDLE;
          }),
          cc.fadeOut(1),
          cc.callFunc(() => {
            cutin.removeFromParentAndCleanup(true);
            spellCardLabel.removeFromParentAndCleanup(true);
            spellCardLabelBg.removeFromParentAndCleanup(true);
          }),
        ])
    );
    this.addChild(cutin);
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
