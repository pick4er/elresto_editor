import range from 'lodash.range';

const head = 3;
const tail = 3;

const headRange = h => range(1, h + 1);
const tailRange = (startPage, t = tail) => range(startPage + 1 - t, startPage + 1);
const middleRange = startPage => range(startPage - 2, startPage + 3).filter(i => i > 0);
const minRange = endPage => range(1, endPage + 1);

export default function paginator(startPage, endPage) {
  const minItems = Math.max(5, head + tail + 2);

  // without gaps
  if (endPage <= minItems) {
    return minRange(endPage);
  }

  // from the beginning
  if (startPage <= head + 3) {
    return [
      ...headRange(startPage + 2),
      null,
      ...tailRange(endPage, minItems - startPage),
    ];
  }

  // from the end
  if (startPage >= endPage - minItems + 2) {
    return [
      ...headRange(minItems - 1 - (endPage - startPage)),
      null,
      ...tailRange(endPage, endPage - startPage + 3),
    ];
  }

  // in the middle
  return [
    ...headRange(head), 
    null, 
    ...middleRange(startPage), 
    null, 
    ...tailRange(startPage, tail)
  ];
}
