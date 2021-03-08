import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const ROW = 20;
const COL = 40;

type Pos = { x: number; y: number };

type DataSliceState = {
  data: boolean[][];
  livingCells: number;
};

const initialState: DataSliceState = {
  data: Array(ROW)
    .fill(null)
    .map(() =>
      Array(COL)
        .fill(null)
        .map(() => false)
    ),
  livingCells: 0,
};

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

const getLivingNeighbours = (state: boolean[][], { x, y }: Pos): number => {
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
  { x, y }: Pos
): boolean => {
  const livingNeighbours = getLivingNeighbours(state, { x, y });

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
      const cellState = getNextCellState(state.data, col, { x, y });
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
    toggleValue: (state, { payload: { x, y } }: PayloadAction<Pos>) => {
      state.data[y][x] = !state.data[y][x];
      state.data[y][x] ? (state.livingCells += 1) : (state.livingCells -= 1);
      return state;
    },
    next: (state) => getNextState(state),
    reset: () => initialState,
  },
});

export const { toggleValue, next, reset } = dataSlice.actions;
export default dataSlice.reducer;
