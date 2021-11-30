export const chunk = <T extends any[]>(targetArray: T, size: number): T[] => {
  return targetArray.reduce((accArray, _, index) => {
    return index % size
      ? accArray
      : [...accArray, targetArray.slice(index, index + size)];
  }, [] as T[][]);
};
