export type Template = number[][];

const t1: Template = [
  [1, 2],
  [1, 5, 6],
  [2, 4, 6],
  [],
  [0, 2, 4],
  [0, 1, 5],
  [4, 5],
];

const t2: Template = [
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

const t3: Template = [
  [2, 6],
  [1, 2, 3, 5, 6, 7],
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [1, 2, 3, 4, 5, 6, 7],
  [2, 3, 4, 5, 6],
  [3, 4, 5],
  [4],
];

const t4: Template = [[1], [0, 1, 2], [1]];

const t5: Template = [[0, 1], [1], [1], [1, 2]];

const t6: Template = [
  [2, 3],
  [2, 3],
  [1, 4],
  [0, 2, 3],
  [0, 2, 3],
];

const t7: Template = [
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

const templates: Template[] = [t1, t2, t3, t4, t5, t6, t7];

class TemplateIndex {
  static index = 0;

  static getTemplateIndex(): number {
    const currentIndex = TemplateIndex.index;
    TemplateIndex.index = (TemplateIndex.index + 1) % templates.length;
    return currentIndex;
  }
}

const getRandomTemplate = (): Template =>
  templates[TemplateIndex.getTemplateIndex()];

export default getRandomTemplate;
