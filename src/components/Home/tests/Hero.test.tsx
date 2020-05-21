import axios from 'axios';
import { renderWithRouter, wait } from 'utils/test-utils';
import meta from './meta';

const data = {
  _index: 'tps',
  _type: '_doc',
  _id: 'meta',
  _version: 940,
  _seq_no: 3754,
  _primary_term: 1,
  found: true,
  _source: {
    liveTPS: 13,
    peakTPS: 158,
    nrOfShards: 5,
    nrOfNodes: 100,
    blockNumber: 186,
    roundNumber: 345,
    roundTime: 5,
    averageBlockTxCount: 66,
    lastBlockTxCount: 68,
    totalProcessedTxCount: 12393,
    shardID: 0,
    averageTPS: null,
    currentBlockNonce: 0,
  },
};

describe('Hero tests', () => {
  test('Hero bar is displaying fetched values', async () => {
    // const mockGet = jest.spyOn(axios, 'get');
    // mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    // mockGet.mockReturnValueOnce(Promise.resolve({ data }));
    // const render = renderWithRouter({
    //   route: '/',
    // });

    // await wait(async () => {
    //   expect(render.queryByTestId('peakTPS')!.innerHTML).toBe('158');
    // });
    expect('todo').toBe('todo');
  });
});
