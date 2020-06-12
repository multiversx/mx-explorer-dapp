import axios from 'axios';
import {
  fireEvent,
  renderWithRouter,
  wait,
  meta,
  config as optionalConfig,
  waitForElement,
} from 'utils/test-utils';
// import data from './blocks';
import { heartbeatstatus, validators, transactionsSearch, blocks, statistics } from 'utils/rawData';

export const beforeAll = () => {
  const mockPost = jest.spyOn(axios, 'post');
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockImplementation((url: string): any => {
    switch (true) {
      // --- page load ---
      case url.includes('/tps/_doc/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: heartbeatstatus });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: statistics });
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      // --- page load ---
    }
  });
  mockPost.mockImplementation((url: string): any => {
    switch (true) {
      case url.includes('/blocks/_search'):
        return Promise.resolve({ data: blocks });
      case url.includes('/transactions/_search'):
        return Promise.resolve({ data: transactionsSearch });
    }
  });
  return renderWithRouter({
    route: '/',
    optionalConfig,
  });
};

describe('Latest Blocks', () => {
  test('Latest Blocks component is displaying', async () => {
    const render = beforeAll();
    await wait(async () => {
      expect(render.queryByTestId('blocksList')!.childElementCount).toBe(25);
    });
  });
  test('Latest Blocks component loading state', async () => {
    const render = beforeAll();
    // correct way to get rid of not wrapped in act
    // https://stackoverflow.com/a/60164821/4264699
    const blocksLoader = await waitForElement(() => render.queryByTestId('blocksLoader'));
    expect(blocksLoader).toBeDefined();
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

    expect(blockLink.innerHTML).toBe(blocks.hits.hits[0]._source.nonce.toString());
    fireEvent.click(blockLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Block Hash Link', async () => {
    const render = beforeAll();

    const blockHashLink = await render.findByTestId('blockHashLink0');
    expect(blockHashLink).toBeInTheDocument();

    expect(blockHashLink.innerHTML).toBe('d075d4fef6...80c35e7097');
    fireEvent.click(blockHashLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
