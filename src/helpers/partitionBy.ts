export const partitionBy = (
  array: any[],
  fn: (v: any, i: number, ar: any[]) => boolean
) =>
  array.reduce(
    (acc, item, index, arr) => {
      acc[Number(!fn(item, index, arr))].push(item);
      return acc;
    },
    [[], []] as [any[], any[]]
  );
