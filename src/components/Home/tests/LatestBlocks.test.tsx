import axios from 'axios';
import { fireEvent, renderWithRouter, wait, meta } from 'utils/test-utils';
import data from './blocks';
import markers from './markers';
import transactions from './transactions';

export const beforeAll = () => {
  const mockPost = jest.spyOn(axios, 'post');
  const mockGet = jest.spyOn(axios, 'get');
  mockPost.mockReturnValueOnce(Promise.resolve({ data }));
  mockPost.mockReturnValueOnce(Promise.resolve({ data: transactions }));
  mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
  mockGet.mockReturnValueOnce(Promise.resolve({ data: markers }));
  return renderWithRouter({
    route: '/',
  });
};

describe('Latest Blocks', () => {
  test('Latest Blocks component is displaying', async () => {
    const render = beforeAll();
    await wait(async () => {
      expect(render.queryByTestId('blocksList')!.childElementCount).toBe(20);
    });
  });
  test('Latest Blocks component loading state', async () => {
    const render = beforeAll();
    expect(render.queryByTestId('blocksLoader')).toBeDefined();
  });
  test('Latest Blocks component failing state', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValueOnce(new Error('the error'));

    const render = beforeAll();
    await wait(async () => {
      expect(render.queryByText('Unable to load blocks')).toBeDefined();
    });
  });
});

describe('Latest Blocks Links', () => {
  test('View All Blocks', async () => {
    const render = beforeAll();

    const allBlocksLink = await render.findByText('View All Blocks');
    expect(allBlocksLink).toBeInTheDocument();

    fireEvent.click(allBlocksLink);
    await wait(async () => {
      expect(document.title).toEqual('Blocks • Elrond Explorer');
    });
  });
  test('Block Link', async () => {
    const render = beforeAll();

    const blockLink = await render.findByTestId('blockLink0');
    expect(blockLink).toBeInTheDocument();

    expect(blockLink.innerHTML).toBe(data.hits.hits[0]._source.nonce.toString());
    fireEvent.click(blockLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Block Hash Link', async () => {
    const render = beforeAll();

    const blockHashLink = await render.findByTestId('blockHashLink0');
    expect(blockHashLink).toBeInTheDocument();

    expect(blockHashLink.innerHTML).toBe('a34f4608be...a972097a38');
    fireEvent.click(blockHashLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
