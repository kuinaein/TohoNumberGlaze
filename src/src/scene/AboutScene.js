import {createSimpleScene} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';

/** @type {cc.Layer} */
const aboutLayerProps = {
  ctor() {
    this._super(cc.color.WHITE);

    const medicine = new cc.Sprite(RESOURCE_MAP.Medicine_png);
    medicine.setOpacity(48);
    medicine.setAnchorPoint(cc.p(1, 0));
    medicine.x = cc.winSize.width * 0.9;
    this.addChild(medicine);

    const titleLabel = new cc.LabelTTF(
        '東方ナンバーグレイズについて',
        'serif',
        cc.winSize.height * 0.12
    );
    titleLabel.setAnchorPoint(cc.p(0.5, 1));
    titleLabel.setFontFillColor(cc.color.BLACK);
    titleLabel.x = cc.winSize.width / 2;
    titleLabel.y = cc.winSize.height * 0.95;
    this.addChild(titleLabel);

    this.initCreditTitle();

    const notes2 = new cc.LabelTTF(
        `なお、本作品は水鶏の個人制作であり、
上記の方々とは、素材の提供を除き一切関係がありません。`,
        'sans-serif',
        cc.winSize.height * 0.04
    );
    notes2.setFontFillColor(cc.color.BLACK);
    notes2.setAnchorPoint(cc.p(0, 0));
    notes2.setPosition(cc.p(cc.winSize.width * 0.1, cc.winSize.height * 0.05));
    this.addChild(notes2);

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);
  },

  initCreditTitle() {
    const notes = new cc.LabelTTF(
        `- 本作品に登場するキャラクターや世界観等の著作権は、
   上海アリス幻樂団様が保有しています。
- その他、下記の方々の素材を利用させていただきました。
   - エルル様    配布元サイト「えるるのだいあり」
   - 二ノ瀬泰徳様    配布元サイト「ニコニ・コモンズ」
     他多数
    ※上記は基本的に、利用にあたりクレジット表記が必須とされているもののみ`,
        'sans-serif',
        cc.winSize.height * 0.04
    );
    notes.setFontFillColor(cc.color.BLACK);
    notes.setAnchorPoint(cc.p(0, 1));
    notes.setPosition(cc.p(cc.winSize.width * 0.1, cc.winSize.height * 0.75));
    this.addChild(notes);
  },

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {boolean}
   */
  onTouchBegan(touch, event) {
    cc.eventManager.removeAllListeners();
    cc.director.runScene(new tng.FirstScene());
    // cc.audioEngine.playEffect(RESOURCE_MAP.SE_Transition_mp3);
    return false;
  },
};

export const AboutScene = createSimpleScene(aboutLayerProps, cc.LayerColor);
