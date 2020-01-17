import axios from 'axios';
import { renderWithRouter, wait } from '../../../utils/test-utils';
import blocks from './blocks';
import doc from './doc';
import validators from './validators';

const meta = {
  _index: 'tps',
  _type: '_doc',
  _id: 'meta',
  _version: 47628,
  _seq_no: 76004,
  _primary_term: 1,
  found: true,
  _source: {
    liveTPS: 125,
    peakTPS: 858,
    nrOfShards: 5,
    nrOfNodes: 100,
    blockNumber: 9480,
    roundNumber: 11502,
    roundTime: 6,
    averageBlockTxCount: 351,
    lastBlockTxCount: 755,
    totalProcessedTxCount: 3332899,
    shardID: 0,
    averageTPS: null,
    currentBlockNonce: 0,
  },
};

describe('Block Details', () => {
  test('Block Details page is displaying', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: doc }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: validators }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: blocks }));

    const render = renderWithRouter({
      route: `/blocks/${doc._source.hash}`,
    });
    expect(document.title).toEqual('Block Details • Elrond Explorer');
    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Block Details');
    });
    expect(render.getByText(doc._source.nonce.toString())).toBeInTheDocument();
  });
  test('Block Details page loading state', async () => {
    const render = renderWithRouter({
      route: `/blocks/${doc._source.hash}`,
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });
  test('Block Details page failed state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockRejectedValueOnce(new Error('doc error'));

    const render = renderWithRouter({
      route: `/blocks/${doc._source.hash}`,
    });

    const failedState = await render.findByText('Unable to locate this block hash');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Block Details Links', () => {
  test('Block Details page is displaying', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: doc }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: validators }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: blocks }));

    const render = renderWithRouter({
      route: `/blocks/${doc._source.hash}`,
    });
    expect(document.title).toEqual('Block Details • Elrond Explorer');
    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Block Details');
    });
    expect(render.getByText(doc._source.nonce.toString())).toBeInTheDocument();
  });
});
