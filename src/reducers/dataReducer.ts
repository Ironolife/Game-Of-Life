import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const ROW = 45;
const COL = 80;

type Pos = { x: number; y: number };

const initialState = Array(ROW)
  .fill(null)
  .map(() =>
    Array(COL)
      .fill(null)
      .map(() => Math.random() > 0.7)
  );

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    toggleValue: (state, { payload: { x, y } }: PayloadAction<Pos>) => {
      state[x][y] = !state[x][y];
    },
  },
});

export const { toggleValue } = userSlice.actions;
export default userSlice.reducer;
