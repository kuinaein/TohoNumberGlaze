import {createSimpleScene} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';
import {NumberPlaceScene} from '@/scene/NumberPlaceScene';
import {AboutScene} from '@/scene/AboutScene';

const TAG_ABOUT_BUTTON_LABEL = 33;

/**
 * @typedef TitleLayerProps
 * @property {cc.Point} centerOfAboutButon
 * @property {number} radiusOfAboutButton
 */

/** @type {cc.LayerColor & TitleLayerProps} */
const titleLayerProps = {
  ctor() {
    this._super();
    const bg = new cc.Sprite(RESOURCE_MAP.BG_Mari_Sensu_png);
    bg.setScale(cc.winSize.width / bg.getContentSize().width);
    bg.setAnchorPoint(0, 0);
    this.addChild(bg);

    const titleLabel = new cc.Sprite(RESOURCE_MAP.Title_Logo_png);
    titleLabel.x = cc.winSize.width / 2;
    titleLabel.y = cc.winSize.height * 0.65;
    titleLabel.setScale(1.2);
    this.addChild(titleLabel);

    this.initStartLabel();
    this.initAboutButton();

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);
    return true;
  },
  initStartLabel() {
    const tapToStartLabel = new cc.LabelTTF(
        '画面をタップしてスタート',
        'sans-serif',
        cc.winSize.height * 0.07
    );
    tapToStartLabel.setFontFillColor(cc.color.BLACK);
    tapToStartLabel.x = cc.winSize.width * 0.5;
    tapToStartLabel.y = cc.winSize.height * 0.3;
    this.addChild(tapToStartLabel);
  },
  initAboutButton() {
    const aboutButton = new cc.DrawNode();
    aboutButton.setAnchorPoint(1, 0);
    this.centerOfAboutButon = cc.p(
        cc.winSize.width * 0.12,
        cc.winSize.height * 0.2
    );
    this.radiusOfAboutButton = cc.winSize.height * 0.15;
    aboutButton.drawDot(
        this.centerOfAboutButon,
        this.radiusOfAboutButton,
        cc.color(238, 120, 0, 192)
    );
    this.addChild(aboutButton);
    const aboutButtonLabel = new cc.LabelTTF(
        'このアプリに\nついて...',
        'sans-serif',
        cc.winSize.height * 0.04
    );
    aboutButtonLabel.setFontFillColor(cc.color.BLACK);
    aboutButtonLabel.setAnchorPoint(0.5, 0);
    aboutButtonLabel.x = cc.winSize.width * 0.12;
    aboutButtonLabel.y = cc.winSize.height * 0.13;
    aboutButtonLabel.setTag(TAG_ABOUT_BUTTON_LABEL);
    this.addChild(aboutButtonLabel);
  },
  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {boolean}
   */
  onTouchBegan(touch, event) {
    cc.eventManager.removeAllListeners();
    const r2 = Math.pow(this.radiusOfAboutButton, 2);
    if (r2 > cc.pDistanceSQ(touch.getLocation(), this.centerOfAboutButon)) {
      cc.director.runScene(new AboutScene());
      // cc.audioEngine.playEffect(RESOURCE_MAP.SE_Transition_mp3);
    } else {
      cc.director.runScene(new NumberPlaceScene());
      // cc.audioEngine.playEffect(RESOURCE_MAP.SE_Transition_mp3);
    }
    return false;
  },
};

export const TitleScene = createSimpleScene(titleLayerProps);
