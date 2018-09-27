import {sudoku} from '@/lib/sudoku/sudoku';

/** @class */
export class NumberPlaceModel {
  /**
   * @param {string|number} difficulty sudoku.jsのドキュメントを参照
   * @see https://github.com/robatron/sudoku.js
   */
  constructor(difficulty) {
    this.initial = sudoku.generate(difficulty);
    this.current = this.initial;
  }

  /** */
  printBoard() {
    sudoku.print_board(this.current);
  }

  /**
   * @param {number} rowIndex
   * @param {number} colIndex
   * @return {?number}
   */
  get(rowIndex, colIndex) {
    const ch = this.current.charAt(9 * rowIndex + colIndex);
    return '.' === ch ? null : parseInt(ch);
  }

  /**
   * あるマス目の値が最初からt設定されていたかどうかを返す
   *
   * @param {number} rowIndex
   * @param {number} colIndex
   * @return {boolean}
   */
  isFixed(rowIndex, colIndex) {
    const ch = this.initial.charAt(9 * rowIndex + colIndex);
    return '.' !== ch;
  }
}
