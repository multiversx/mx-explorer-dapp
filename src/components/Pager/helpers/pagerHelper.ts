import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';

import { ELLIPSIS } from 'appConstants';

interface PagerHelperType {
  total: number;
  itemsPerPage: number;
  page: number;
}

const generatePaginationArray = ({
  currentPage,
  totalPages
}: {
  currentPage: number;
  totalPages: number;
}) => {
  if (totalPages <= 1) return [1];

  const center: (number | string)[] = [currentPage];

  center.unshift(currentPage - 1);
  center.push(currentPage + 1);

  const filteredCenter = center.filter(
    (page) => Number(page) > 1 && Number(page) < totalPages
  );

  const includeLeftGap = currentPage > 4;
  const includeLeftPages = currentPage === 4;
  const includeRightGap = currentPage < totalPages - 3;
  const includeRightPages = currentPage === totalPages - 3;

  if (includeLeftPages) filteredCenter.unshift(2);
  if (includeRightPages) filteredCenter.push(totalPages - 1);
  if (includeLeftGap) filteredCenter.unshift(ELLIPSIS);
  if (includeRightGap) filteredCenter.push(ELLIPSIS);

  return [1, ...filteredCenter, totalPages];
};

export const pagerHelper = ({ total, itemsPerPage, page }: PagerHelperType) => {
  const processedPage = stringIsInteger(String(page))
    ? parseInt(String(page))
    : 1;
  const start =
    (processedPage - 1) * itemsPerPage + (processedPage === 1 ? 1 : 0);
  const end =
    (processedPage - 1) * itemsPerPage +
    (total < itemsPerPage ? total : itemsPerPage);
  const last = Math.min(end, total);
  const correction = processedPage >= 2 ? 0 : 1;
  const lastPage = Math.floor(total / (end - start + correction));

  const paginationArray = generatePaginationArray({
    currentPage: processedPage,
    totalPages: !isNaN(lastPage) ? lastPage : processedPage
  });

  return {
    processedPage,
    start,
    end,
    last,
    lastPage,
    paginationArray
  };
};
