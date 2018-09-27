import {sudoku} from '@/lib/sudoku/sudoku';

/** @class */
export class NumberPlaceModel {
  /**
   * @param {string|number} difficulty sudoku.jsのドキュメントを参照
   * @see https://github.com/robatron/sudoku.js
   */
  constructor(difficulty) {
    this.initial = sudoku.generate(difficulty);
    /** @type {string} */
    this.current = this.initial;
  }

  /** */
  printBoard() {
    sudoku.print_board(this.current);
  }

  /**
   * @param {number} rowIndex
   * @param {number} colIndex
   * @return {number}
   */
  calcPos(rowIndex, colIndex) {
    return 9 * rowIndex + colIndex;
  }

  /**
   * @param {number} rowIndex
   * @param {number} colIndex
   * @return {?number}
   */
  get(rowIndex, colIndex) {
    const ch = this.current.charAt(this.calcPos(rowIndex, colIndex));
    return '.' === ch ? null : parseInt(ch);
  }

  /**
   * @param {number} rowIndex
   * @param {number} colIndex
   * @param {number|null} value
   */
  set(rowIndex, colIndex, value) {
    const pos = this.calcPos(rowIndex, colIndex);
    const ch = value ? '' + value : '.';
    this.current =
      this.current.substring(0, pos) + ch + this.current.substring(pos + 1);
  }

  /**
   * あるマス目の値が最初からt設定されていたかどうかを返す
   *
   * @param {number} rowIndex
   * @param {number} colIndex
   * @return {boolean}
   */
  isFixed(rowIndex, colIndex) {
    const ch = this.initial.charAt(this.calcPos(rowIndex, colIndex));
    return '.' !== ch;
  }
}
