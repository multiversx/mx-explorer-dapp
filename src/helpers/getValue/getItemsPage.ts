import BigNumber from 'bignumber.js';

interface GetItemsPageType {
  currentPage: number;
  itemsPerPage: number;
  items: any[];
}

export const getItemsPage = ({
  items,
  currentPage,
  itemsPerPage
}: GetItemsPageType) => {
  const itemsPerPageBigNumber = new BigNumber(itemsPerPage);
  const currentPageBigNumber = new BigNumber(currentPage);
  const itemsLengthBigNumber = new BigNumber(items.length);

  const totalPages = Math.ceil(
    itemsLengthBigNumber.dividedBy(itemsPerPage).toNumber()
  );

  const totalPagesArray = Array.from({ length: totalPages });
  const ranges = totalPagesArray.map((_, index) => [
    itemsPerPageBigNumber.times(index),
    itemsPerPageBigNumber.times(new BigNumber(index).plus(1))
  ]);

  const rangesLengthBigNumber = new BigNumber(ranges.length);
  const currentRange = ranges.find((_, index) => {
    if (rangesLengthBigNumber.lte(currentPage)) {
      return rangesLengthBigNumber.minus(1).isEqualTo(index);
    }

    return currentPageBigNumber.minus(1).isEqualTo(index);
  });

  if (!currentRange) {
    return items;
  }

  const [currentRangeStart, currentRangeEnd] = currentRange;
  const slicedTokensArray = items.slice(
    currentRangeStart.toNumber(),
    currentRangeEnd.toNumber()
  );

  return slicedTokensArray;
};
