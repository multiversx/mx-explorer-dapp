import axios from 'axios';
import { fireEvent, renderWithRouter, wait } from 'utils/test-utils';
import data from './blocks';

const count = { count: 49932, _shards: { total: 5, successful: 5, skipped: 0, failed: 0 } };

describe('Blocks', () => {
  test('Blocks page is displaying', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: count }));

    const render = renderWithRouter({
      route: '/blocks',
    });

    expect(document.title).toEqual('Blocks • Elrond Explorer');

    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Blocks');
      const table = await render.findByTestId('blocksTable');
      expect(table.childElementCount).toBe(25);
    });
  });
  test('Blocks page loading state', async () => {
    const render = renderWithRouter({
      route: '/blocks',
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });
  test('Blocks page failed state', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValueOnce(new Error('the error'));

    const render = renderWithRouter({
      route: '/blocks',
    });

    const failedState = await render.findByText('Unable to load blocks');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Blocks Page Links', () => {
  test('Block link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: count }));

    const render = renderWithRouter({
      route: '/blocks',
    });

    const link = await render.findByTestId('blockLink0');
    expect(link.innerHTML).toBe('9111');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });

  test('Block shard link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: count }));

    const render = renderWithRouter({
      route: '/blocks',
    });

    const link = await render.findByTestId('blockShardLink0');
    expect(link.textContent).toBe('Shard 1');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });

  test('Block Hash link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: count }));

    const render = renderWithRouter({
      route: '/blocks',
    });

    const link = await render.findByTestId('blockHashLink0');
    expect(link.textContent).toBe('d075d4fef60b3dfa5...');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
