import MersenneTwister from 'mersenne-twister';
import moment from 'moment';
import {sudoku} from '@/lib/sudoku/sudoku';

import {createSimpleScene, createBgLayer} from '@/util/cocos2d-util';

import {SpellGauge} from '@/scene/SpellGauge';
import {NumberPlaceModel} from '@/scene/NumberPlaceModel';
import {NumberPlaceSquare} from '@/scene/NumberPlaceSquare';
import {NumberChooser} from '@/scene/NumberChooser';
import {SpellCardChooser} from '@/scene/SpellCardChooser';

import {RESOURCE_MAP} from '@/resource';
import {Maru9, SpellCard} from '@/character/SpellCard';

// eslint-disable-next-line no-unused-vars
const unused = SpellCard;

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
 * @property {moment.Moment} startTime
 * @property {moment.Moment} endTime
 * @property {NumberPlaceModel} model
 * @property {cc.LabelTTF} timeLabel
 * @property {SpellGauge} spellGauge;
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

    this.initBg();
    this.spellGauge = new SpellGauge();
    this.addChild(this.spellGauge.getNode());
    this.initPlayerCharacter();
    this.spellCardChooser = new SpellCardChooser([new Maru9()]);
    this.addChild(this.spellCardChooser.getNode());
    this.initSquares();

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);

    this.startTime = moment();
    // easyモードでも3分だと運ゲーになる
    this.endTime = this.startTime.clone().add(10, 'minutes');
    this.scheduleUpdate();
  },

  initBg() {
    const bg = new cc.Sprite(RESOURCE_MAP.BG_Mari_Sensu_png);
    bg.setAnchorPoint(0, 0);
    bg.setScale(cc.winSize.height / bg.getContentSize().height);
    this.addChild(bg);

    const timeFrame = new cc.Sprite(RESOURCE_MAP.Window_Green_png);
    const timeFrameBg = createBgLayer(timeFrame, cc.color.WHITE, {
      widthRatio: 1,
    });
    timeFrameBg.setScale(0.2);
    timeFrameBg.setPosition(cc.winSize.width * 0.38, cc.winSize.height * 0.1);
    this.addChild(timeFrameBg);

    const timeLabel = new cc.LabelTTF(
        '',
        'sans-serif',
        cc.winSize.height * 0.07
    );
    timeLabel.setFontFillColor(cc.color.BLACK);
    const tmBox = timeFrameBg.getBoundingBoxToWorld();
    timeLabel.setPosition(
        tmBox.x + tmBox.width / 2,
        tmBox.y + tmBox.height / 2
    );
    this.addChild(timeLabel);
    this.timeLabel = timeLabel;
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

  getMode() {
    return this.mode;
  },

  setMode(mode) {
    if (NumberPlaceMode.STAGE_END !== this.getMode()) {
      this.mode = mode;
    }
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

  update(dt) {
    this._super(dt);

    if (NumberPlaceMode.STAGE_END === this.getMode()) {
      return;
    }

    const curTime = moment();
    if (curTime.isAfter(this.endTime)) {
      this.setMode(NumberPlaceMode.STAGE_END);
      const timeOver = new cc.LabelTTF(
          'TIME OVER...',
          'sans-serif',
          cc.winSize.height * 0.2
      );
      timeOver.setFontFillColor(cc.color(201, 23, 30)); // 深緋
      const timeOverBg = createBgLayer(timeOver, cc.color(0, 0, 0, 192));
      timeOverBg.ignoreAnchorPointForPosition(false);
      timeOverBg.setPosition(cc.winSize.width / 2, cc.winSize.height);
      timeOverBg.runAction(cc.moveBy(0.5, 0, -cc.winSize.height / 2));
      this.addChild(timeOverBg);
      return;
    }
    const diffTime = moment.duration(this.endTime.diff(curTime));
    const m = this.padNum2(diffTime.get('m'));
    const s = this.padNum2(diffTime.get('s'));
    const remains = `残 ${m}:${s}`;
    this.timeLabel.setString(remains);
  },

  padNum2(n) {
    return ('00' + n).slice(-2);
  },

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {boolean}
   */
  onTouchBegan(touch, event) {
    if (NumberPlaceMode.PLAYING_IDLE !== this.getMode()) {
      return false;
    }
    this.setMode(NumberPlaceMode.PLAYING_BUSY);

    if (this.numberChooser.isVisible()) {
      const choice = this.numberChooser.handleOnTouch(touch, event);
      switch (choice) {
        case -1:
          this.rockLayer();
          break;
        case 0:
          break;
        default:
          this.spellGauge.updateGauge(+1);
          if (this.model.isSolved()) {
            this.onSolved();
          }
      }

      this.setMode(NumberPlaceMode.PLAYING_IDLE);
      return false;
    }

    if (this.showNumberChooser(touch)) {
      this.setMode(NumberPlaceMode.PLAYING_IDLE);
      return false;
    }
    const spellCard = this.spellCardChooser.handleOnTouch(touch, event);
    if (spellCard) {
      this.castSpell(spellCard);
      return false;
    }

    this.setMode(NumberPlaceMode.PLAYING_IDLE);
    return false;
  },

  /**
   * @param {cc.Touch} touch
   * @return {boolean} どれかのマスに対し選択肢を表示したかどうか. 即ちこのメソッドでイベント処理が終わる場合true
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
    this.setMode(NumberPlaceMode.STAGE_END);
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

  /**
   * @param {SpellCard} spellCard
   */
  castSpell(spellCard) {
    if (!this.canCastSpell(spellCard)) {
      this.rockLayer();
      this.setMode(NumberPlaceMode.PLAYING_IDLE);
      return;
    }
    this.spellGauge.updateGauge(-spellCard.getConsumption());

    let targetSq;
    const candidates = sudoku.get_candidates(this.model.getCurrentBoard());
    const start = this.mt.random_int() % BOARD_AREA;
    for (let i = 0; i < BOARD_AREA; ++i) {
      const r = Math.floor(((start + i) % BOARD_AREA) / BOARD_WIDTH);
      const c = (start + i) % BOARD_WIDTH;
      const cand = candidates[r][c];
      if (0 <= cand.indexOf('9')) {
        const sq = this.squares[r][c];
        if (null === sq.getValue()) {
          // たまに候補に出る値で解けないときがあるのでチェック
          if (sq.setValue(9, false)) {
            sq.setValue(null, false);
            targetSq = sq;
            break;
          }
        }
      }
    }

    this.showSpell(spellCard, targetSq);
  },

  /**
   * @param {SpellCard} spellCard
   * @return {boolean}
   */
  canCastSpell(spellCard) {
    if (spellCard.getConsumption() > this.spellGauge.getPoint()) {
      return false;
    }

    const board = this.model.getCurrentBoard();
    const numNines = board.replace(/[^9]/g, '').length;
    if (BOARD_WIDTH === numNines) {
      return false;
    }

    return true;
  },

  /**
   * @param {SpellCard} spellCard
   * @param {NumberPlaceSquare} targetSq
   */
  showSpell(spellCard, targetSq) {
    this.playerCharacter.setAnimation(0, 'spell', false);
    const FIRST_HALF_DURATION = 0.5;
    const SECOND_HALF_DURATION = 5;

    const spellCardLabel = new cc.LabelTTF(
        spellCard.getName(),
        'sans-serif',
        cc.winSize.height * 0.08
    );
    const spellCardLabelBg = createBgLayer(
        spellCardLabel,
        cc.color(0, 0, 0, 128)
    );
    spellCardLabelBg.setAnchorPoint(0, 1);
    spellCardLabelBg.setPosition(
        cc.winSize.width * 0.55,
        cc.winSize.height * 0.85
    );
    spellCardLabelBg.setOpacity(0);
    spellCardLabelBg.runAction(
        cc.sequence([
          cc.fadeIn(FIRST_HALF_DURATION),
          cc.fadeOut(SECOND_HALF_DURATION),
        ])
    );

    this.addChild(spellCardLabelBg);

    const snow = new cc.Sprite(RESOURCE_MAP.Particle_snow_png);
    snow.setScale(0.5);
    snow.setColor(cc.color(0, 255, 255, 128));
    snow.setPosition(this.playerCharacter.getPosition());
    const sqBox = targetSq.getNode().getBoundingBoxToWorld();
    snow.runAction(
        cc.sequence([
          cc.moveTo(
              FIRST_HALF_DURATION,
              sqBox.x + sqBox.width / 2,
              sqBox.y + sqBox.height / 2
          ),
          cc.callFunc(() => {
            snow.removeFromParentAndCleanup(true);
          }),
        ])
    );
    this.addChild(snow);

    const cutin = new cc.Sprite(RESOURCE_MAP.Cutin_Chillno_png);
    cutin.setPosition(cc.winSize.width * 0.75, 0);
    cutin.setScale(0.25);
    cutin.setOpacity(0);
    cutin.runAction(
        cc.sequence([
          cc.spawn([
            cc.moveBy(FIRST_HALF_DURATION, 0, cc.winSize.height * 0.4),
            cc.fadeIn(FIRST_HALF_DURATION),
          ]),
          cc.callFunc(() => {
            targetSq.setValue(9);
            this.playerCharacter.setAnimation(0, 'float', true);
            this.setMode(NumberPlaceMode.PLAYING_IDLE);
            this.explodeSquare(targetSq);
            if (this.model.isSolved()) {
              this.onSolved();
            }
          }),
          cc.fadeOut(SECOND_HALF_DURATION),
          cc.callFunc(() => {
            cutin.removeFromParentAndCleanup(true);
            spellCardLabel.removeFromParentAndCleanup(true);
            spellCardLabelBg.removeFromParentAndCleanup(true);
          }),
        ])
    );
    this.addChild(cutin);
  },

  /**
   * @param {NumberPlaceSquare} targetSq
   */
  explodeSquare(targetSq) {
    const particle = new cc.ParticleExplosion();
    particle.initWithTotalParticles(9);
    const sqBox = targetSq.getNode().getBoundingBoxToWorld();
    particle.setPosition(sqBox.x + sqBox.width / 2, sqBox.y + sqBox.height / 2);
    particle.setTexture(
        new cc.Sprite(RESOURCE_MAP.Particle_snow_png).getTexture()
    );
    particle.setStartColor(cc.color.WHITE);
    particle.setStartColorVar(cc.color(255, 0, 0));
    particle.setEndColor(cc.color.BLUE);
    particle.setSpeed(cc.winSize.height * 0.5);
    particle.setScale(2);
    particle.setAutoRemoveOnFinish(true);
    this.addChild(particle, 5);
  },

  /** 画面を揺らす */
  rockLayer() {
    // TODO 効果音入れる
    this.setMode(NumberPlaceMode.PLAYING_BUSY);
    const dist = cc.winSize.width * 0.01;
    this.runAction(
        cc.sequence([
          cc.moveTo(0.05, cc.p(-dist, 0)),
          cc.moveTo(0.05, cc.p(dist, 0)),
          cc.moveTo(0.05, cc.p(0, 0)),
          cc.callFunc(() => {
            this.setMode(NumberPlaceMode.PLAYING_IDLE);
          }),
        ])
    );
  },
};

export const NumberPlaceScene = createSimpleScene(numberPlaceLayerProps);
