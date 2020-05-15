import axios from 'axios';
import { fireEvent, renderWithRouter, wait } from 'utils/test-utils';
import data from './blocks';

describe('Latest Blocks', () => {
  test('Latest Blocks component is displaying', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    const render = renderWithRouter({
      route: '/',
    });

    await wait(async () => {
      expect(render.queryByTestId('blocksList')!.childElementCount).toBe(20);
    });
  });
  test('Latest Blocks component loading state', async () => {
    const render = renderWithRouter({
      route: '/',
    });
    expect(render.queryByTestId('blocksLoader')).toBeDefined();
  });
  test('Latest Blocks component failing state', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValueOnce(new Error('the error'));

    const render = renderWithRouter({
      route: '/',
    });
    await wait(async () => {
      expect(render.queryByText('Unable to load blocks')).toBeDefined();
    });
  });
});

describe('Latest Blocks Links', () => {
  test('View All Blocks', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    const render = renderWithRouter({
      route: '/',
    });

    const allBlocksLink = await render.findByText('View All Blocks');
    expect(allBlocksLink).toBeInTheDocument();

    fireEvent.click(allBlocksLink);
    await wait(async () => {
      expect(document.title).toEqual('Blocks • Elrond Explorer');
    });
  });
  test('Block Link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    const render = renderWithRouter({
      route: '/',
    });

    const blockLink = await render.findByTestId('blockLink0');
    expect(blockLink).toBeInTheDocument();

    expect(blockLink.innerHTML).toBe(data.hits.hits[0]._source.nonce.toString());
    fireEvent.click(blockLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Block Hash Link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    const render = renderWithRouter({
      route: '/',
    });

    const blockHashLink = await render.findByTestId('blockHashLink0');
    expect(blockHashLink).toBeInTheDocument();

    expect(blockHashLink.innerHTML).toBe('a34f4608be3c...99a972097a38');
    fireEvent.click(blockHashLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
