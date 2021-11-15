export const trimUndefined = <T extends undefined>(
  item: T
): item is Exclude<typeof item, undefined> => item !== undefined;
