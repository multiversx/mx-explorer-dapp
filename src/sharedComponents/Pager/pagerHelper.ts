import { isValidInteger } from 'helpers';

interface PagerHelperType {
  total: number;
  itemsPerPage: number;
  page: string;
}

export default function pagerHelper({ total, itemsPerPage, page }: PagerHelperType) {
  const size = isValidInteger(page) ? parseInt(page) : 1;
  const start = (size - 1) * itemsPerPage + (size === 1 ? 1 : 0);
  const end = (size - 1) * itemsPerPage + (total < itemsPerPage ? total : itemsPerPage);
  const last = !isNaN(parseInt(total.toString())) ? Math.min(end, parseInt(total.toString())) : end;
  const correction = size >= 2 ? 0 : 1;
  const lastPage = Math.ceil(total / (end - start + correction));

  return {
    size,
    start,
    end,
    last,
    lastPage,
  };
}
