import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Template } from '../../utils/templates';

const ROW = 20;
const COL = 31;

export type Data = boolean[][];
export type Pos = { y: number; x: number };

export const getEmptyShape = (height: number, width: number): Data =>
  Array(height)
    .fill(null)
    .map(() =>
      Array(width)
        .fill(null)
        .map(() => false)
    );

type DataSliceState = {
  startData: Data | null;
  data: Data;
  livingCells: number;
};

const initialState: DataSliceState = {
  startData: null,
  data: getEmptyShape(ROW, COL),
  livingCells: 0,
};

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

const getLivingNeighbours = (state: Data, { y, x }: Pos): number => {
  let count = 0;

  const top = y - 1;
  const bottom = y + 1;
  const left = x - 1;
  const right = x + 1;

  const hasTop = top >= 0;
  const hasBottom = bottom < ROW;
  const hasLeft = left >= 0;
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

const getNextCellState = (state: Data, value: boolean, pos: Pos): boolean => {
  const livingNeighbours = getLivingNeighbours(state, pos);

  if (value) {
    if (livingNeighbours < 2 || livingNeighbours > 3) return false;
    return true;
  } else {
    if (livingNeighbours === 3) return true;
    return false;
  }
};

const getNextState = ({ startData, data }: DataSliceState): DataSliceState => {
  let livingCells = 0;
  const newData = data.map((row, y) =>
    row.map((col, x) => {
      const cellState = getNextCellState(data, col, { y, x });
      if (cellState) livingCells += 1;
      return cellState;
    })
  );

  return { startData, data: newData, livingCells };
};

export const templateToData = (
  template: Template,
  maxRow: number,
  maxCol: number
): Data | null => {
  const height = template.length;
  const width = Math.max(...template.map((row) => Math.max(...row))) + 1;
  if (height > maxRow || width > maxCol) return null;

  const data = getEmptyShape(maxRow, maxCol);

  // position shape at center
  const yOffSet = Math.floor((maxRow - height) / 2);
  const xOffSet = Math.floor((maxCol - width) / 2);

  template.forEach((row, y) =>
    row.forEach((x) => (data[y + yOffSet][x + xOffSet] = true))
  );

  return data;
};

const dataSlice = createSlice({
  name: 'dataSlice',
  initialState,
  reducers: {
    toggleValue: (
      { data, livingCells },
      { payload: { y, x } }: PayloadAction<Pos>
    ) => {
      const newData: Data = data.map((row, _y) =>
        row.map((col, _x) => {
          if (y === _y && x == _x) return !col;
          return col;
        })
      );

      return {
        startData: newData,
        data: newData,
        livingCells: newData[y][x] ? livingCells + 1 : livingCells - 1,
      };
    },
    next: (state) => getNextState(state),
    useTemplate: (_, { payload: template }: PayloadAction<Template>) => {
      const data = templateToData(template, ROW, COL);
      if (!data) return;

      const livingCells = template.reduce((acc, cur) => acc + cur.length, 0);

      return { startData: data, data, livingCells };
    },
    reset: ({ startData }) => {
      if (startData) {
        return {
          startData,
          data: startData,
          livingCells: startData.reduce(
            (acc, cur) => acc + cur.filter((cur) => cur).length,
            0
          ),
        };
      }
    },
    clear: () => initialState,
  },
});

export const {
  toggleValue,
  next,
  useTemplate,
  reset,
  clear,
} = dataSlice.actions;
export default dataSlice.reducer;
