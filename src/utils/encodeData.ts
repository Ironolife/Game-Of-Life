import { Data } from '../store/reducers/data.reducer';
import { Template } from './templates';

export const encodeData = (data: Data): string => {
  const template: Template = [];
  let height = Number.NEGATIVE_INFINITY;
  let xMin = Number.POSITIVE_INFINITY;

  data.forEach((row) => {
    const livingCells = row.reduce((acc, cur, x) => {
      if (cur) {
        acc.push(x);
        if (x < xMin) xMin = x;
      }
      return acc;
    }, [] as number[]);

    if (livingCells.length > 0) {
      template.push(livingCells);
      height = template.length;
    } else if (template.length) template.push([]);
  });

  // remove bottom side blank edge
  template.splice(height, template.length - height);
  // offset x axis
  template.forEach((row) => row.forEach((value, i) => (row[i] = value - xMin)));

  const json = JSON.stringify(template);

  return btoa(json);
};

export const decodeData = (encoded: string): Template => {
  const json = atob(encoded);
  return JSON.parse(json) as Template;
};
