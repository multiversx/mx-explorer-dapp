import { stringIsInteger } from 'helpers';

interface PagerHelperType {
  total: number | '...';
  itemsPerPage: number;
  page: string;
}

export default function pagerHelper({ total, itemsPerPage, page }: PagerHelperType) {
  const numericTotal = total === '...' ? 0 : total;
  const size = stringIsInteger(page) ? parseInt(page) : 1;
  const start = (size - 1) * itemsPerPage + (size === 1 ? 1 : 0);
  const end =
    (size - 1) * itemsPerPage +
    (numericTotal < itemsPerPage && total !== '...' ? numericTotal : itemsPerPage);
  const last = !isNaN(parseInt(total.toString())) ? Math.min(end, parseInt(total.toString())) : end;
  const correction = size >= 2 ? 0 : 1;
  const lastPage = Math.ceil(numericTotal / (end - start + correction));

  return {
    size,
    start,
    end,
    last,
    lastPage,
  };
}
