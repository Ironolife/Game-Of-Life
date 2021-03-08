import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRandomTemplate } from '../utils/templates';

const ROW = 20;
const COL = 31;

export type Pos = { y: number; x: number };

export const getEmptyShape = (height: number, width: number) =>
  Array(height)
    .fill(null)
    .map(() =>
      Array(width)
        .fill(null)
        .map(() => false)
    );

type DataSliceState = {
  data: boolean[][];
  livingCells: number;
};

const initialState: DataSliceState = {
  data: getEmptyShape(ROW, COL),
  livingCells: 0,
};

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

const getLivingNeighbours = (state: boolean[][], { y, x }: Pos): number => {
  let count = 0;

  const top = y - 1;
  const bottom = y + 1;
  const left = x - 1;
  const right = x + 1;

  const hasTop = top > 0;
  const hasBottom = bottom < ROW;
  const hasLeft = left > 0;
  const hasRight = right < COL;

  if (hasTop) {
    // top left
    if (hasLeft && state[top][left]) count += 1;
    // top
    if (state[top][x]) count += 1;
    // top right
    if (hasRight && state[top][right]) count += 1;
  }

  // left
  if (hasLeft && state[y][left]) count += 1;
  // right
  if (hasRight && state[y][right]) count += 1;

  if (hasBottom) {
    // bottom left
    if (hasLeft && state[bottom][left]) count += 1;
    // bottom
    if (state[bottom][x]) count += 1;
    // bottom right
    if (hasRight && state[bottom][right]) count += 1;
  }

  return count;
};

const getNextCellState = (
  state: boolean[][],
  value: boolean,
  pos: Pos
): boolean => {
  const livingNeighbours = getLivingNeighbours(state, pos);

  if (value) {
    if (livingNeighbours < 2 || livingNeighbours > 3) return false;
    return true;
  } else {
    if (livingNeighbours === 3) return true;
    return false;
  }
};

const getNextState = (state: DataSliceState): DataSliceState => {
  let livingCells = 0;
  const data = state.data.map((row, y) =>
    row.map((col, x) => {
      const cellState = getNextCellState(state.data, col, { y, x });
      if (cellState) livingCells += 1;
      return cellState;
    })
  );

  return { data, livingCells };
};

const dataSlice = createSlice({
  name: 'dataSlice',
  initialState,
  reducers: {
    toggleValue: (state, { payload: { y, x } }: PayloadAction<Pos>) => {
      state.data[y][x] = !state.data[y][x];
      state.data[y][x] ? (state.livingCells += 1) : (state.livingCells -= 1);
    },
    next: (state) => getNextState(state),
    useRandomTemplate: () => {
      const template = getRandomTemplate();
      const h = template.length;
      const w = template[0].length;

      if (h > ROW || w > COL) return;

      const data = getEmptyShape(ROW, COL);

      // position shape at center
      const yOffSet = Math.floor((ROW - h) / 2);
      const xOffSet = Math.floor((COL - w) / 2);

      template.forEach((row, y) =>
        row.forEach((col, x) => (data[y + yOffSet][x + xOffSet] = col))
      );

      const livingCells = template.reduce(
        (acc, cur) => acc + cur.filter((col) => col).length,
        0
      );

      return { data, livingCells };
    },
    reset: () => initialState,
  },
});

export const {
  toggleValue,
  next,
  useRandomTemplate,
  reset,
} = dataSlice.actions;
export default dataSlice.reducer;
