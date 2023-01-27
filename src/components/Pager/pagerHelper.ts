import { stringIsInteger } from 'helpers';

interface PagerHelperType {
  total: number | '...';
  itemsPerPage: number;
  page: string;
}

const generatePaginationArray = ({
  currentPage,
  totalPages
}: {
  currentPage: number;
  totalPages: number;
}) => {
  if (totalPages <= 1) return [1];

  const placeholder = '...';
  const center: (number | string)[] = [currentPage];

  center.unshift(currentPage - 1);
  center.push(currentPage + 1);

  const filteredCenter = center.filter((page) => page > 1 && page < totalPages);

  const includeLeftGap = currentPage > 4;
  const includeLeftPages = currentPage === 4;
  const includeRightGap = currentPage < totalPages - 3;
  const includeRightPages = currentPage === totalPages - 3;

  if (includeLeftPages) filteredCenter.unshift(2);
  if (includeRightPages) filteredCenter.push(totalPages - 1);
  if (includeLeftGap) filteredCenter.unshift(placeholder);
  if (includeRightGap) filteredCenter.push(placeholder);

  return [1, ...filteredCenter, totalPages];
};

export const pagerHelper = ({ total, itemsPerPage, page }: PagerHelperType) => {
  const numericTotal = total === '...' ? 0 : total;
  const size = stringIsInteger(page) ? parseInt(page) : 1;
  const start = (size - 1) * itemsPerPage + (size === 1 ? 1 : 0);
  const end =
    (size - 1) * itemsPerPage +
    (numericTotal < itemsPerPage && total !== '...'
      ? numericTotal
      : itemsPerPage);
  const last = !isNaN(parseInt(total.toString()))
    ? Math.min(end, parseInt(total.toString()))
    : end;
  const correction = size >= 2 ? 0 : 1;
  const lastPage = Math.ceil(numericTotal / (end - start + correction));

  const paginationArray = generatePaginationArray({
    currentPage: size,
    totalPages: !isNaN(lastPage) ? lastPage : size
  });

  return {
    size,
    start,
    end,
    last,
    lastPage,
    paginationArray
  };
};
