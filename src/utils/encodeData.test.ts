import { Data, templateToData } from '../reducers/dataSlice';
import { encodeData, decodeData } from './encodeData';

const cases: [number, number, Data][] = Array(20)
  .fill(null)
  .map(() => {
    const row = Math.floor(Math.random() * 30) + 1;
    const col = Math.floor(Math.random() * 30) + 1;
    const threshhold = Math.random();

    const data = Array(row)
      .fill(null)
      .map(() =>
        Array(col)
          .fill(null)
          .map(() => Math.random() > threshhold)
      );

    data[0][0] = true;
    data[row - 1][col - 1] = true;

    return [row, col, data];
  });

describe(encodeData, () => {
  test.each(cases)('ROW%iCOL%i', (row, col, data) => {
    expect(templateToData(decodeData(encodeData(data)), row, col)).toEqual(
      data
    );
  });
});
