import { PAGE_SIZE } from 'appConstants';
import { getLastOffsetPage } from 'helpers/getValue/getLastOffsetPage';

interface IsCursorPageType {
  page: number;
  size?: number;
}

export const isCursorPage = ({ page, size = PAGE_SIZE }: IsCursorPageType) =>
  page > getLastOffsetPage(size);
