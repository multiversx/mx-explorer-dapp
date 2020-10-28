import pagerHelper from './../pagerHelper';

describe('Pager helper tests', () => {
  test('Pager second page', () => {
    const { size, start, last, lastPage } = pagerHelper({
      page: '2',
      total: 10000,
      itemsPerPage: 25,
    });
    expect(size).toBe(2);
    expect(start).toBe(25);
    expect(last).toBe(50);
    expect(lastPage).toBe(400);
  });
  test('Pager first page', () => {
    const { size, start, last, lastPage } = pagerHelper({
      page: '1',
      total: 10000,
      itemsPerPage: 25,
    });
    expect(size).toBe(1);
    expect(start).toBe(1);
    expect(last).toBe(25);
    expect(lastPage).toBe(400);
  });
  test('Pager invalid page', () => {
    const { size, start, last, lastPage } = pagerHelper({
      page: 'asd',
      total: 10000,
      itemsPerPage: 25,
    });
    expect(size).toBe(1);
    expect(start).toBe(1);
    expect(last).toBe(25);
    expect(lastPage).toBe(400);
  });
  test('Pager negative page', () => {
    const { size, start, last, lastPage } = pagerHelper({
      page: '-2',
      total: 10000,
      itemsPerPage: 25,
    });
    expect(size).toBe(1);
    expect(start).toBe(1);
    expect(last).toBe(25);
    expect(lastPage).toBe(400);
  });
});
