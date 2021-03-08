import { getEmptyShape } from '../reducers/dataSlice';

const t1 = [
  [2, 3, 4, 8, 9, 10],
  [],
  [0, 5, 7, 12],
  [0, 5, 7, 12],
  [0, 5, 7, 12],
  [2, 3, 4, 8, 9, 10],
  [],
  [2, 3, 4, 8, 9, 10],
  [0, 5, 7, 12],
  [0, 5, 7, 12],
  [0, 5, 7, 12],
  [],
  [2, 3, 4, 8, 9, 10],
];

const t2 = [
  [4, 5, 6, 7],
  [],
  [2, 3, 4, 5, 6, 7, 8, 9],
  [],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [],
  [2, 3, 4, 5, 6, 7, 8, 9],
  [],
  [4, 5, 6, 7],
];

const t3 = [[1, 2], [1, 5, 6], [2, 4, 6], [], [0, 2, 4], [0, 1, 5], [4, 5]];

const t4 = [[1], [0, 1, 2], [1]];

const t5 = [[0, 1], [1], [1], [1, 2]];

const t6 = [
  [2, 3],
  [2, 3],
  [1, 4],
  [0, 2, 3],
  [0, 2, 3],
];

const templates = [t1, t2, t3, t4, t5, t6];

class TemplateIndex {
  static index = 0;

  static getTemplateIndex(): number {
    const currentIndex = TemplateIndex.index;
    TemplateIndex.index = (TemplateIndex.index + 1) % templates.length;
    return currentIndex;
  }
}

const getRandomTemplate = (): boolean[][] => {
  const template = templates[TemplateIndex.getTemplateIndex()];

  const height = template.length;
  const width = Math.max(...template.map((row) => Math.max(...row))) + 1;
  const data = getEmptyShape(height, width);

  template.forEach((row, y) => row.forEach((x) => (data[y][x] = true)));

  return data;
};

export default getRandomTemplate;
