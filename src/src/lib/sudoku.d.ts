declare module '@/lib/sudoku/sudoku' {
  export const sudoku: {
  generate(difficulty: string | number, unique?: boolean = true): string;
  solve(puzzle: string): string;
  get_candidates(puzzle: string): string[][];

  board_string_to_grid(puzzle: string): string[][];
  board_grid_to_string(grid: string[][]): string;

  print_board(puzzle: string);
  };
}
