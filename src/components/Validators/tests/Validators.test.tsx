import axios from 'axios';
import { renderWithRouter, wait } from '../../../utils/test-utils';
import heartbeatstatus from './heartbeatstatus';

const meta = {
  _index: 'tps',
  _type: '_doc',
  _id: 'meta',
  _version: 46783,
  _seq_no: 74642,
  _primary_term: 1,
  found: true,
  _source: {
    liveTPS: 164,
    peakTPS: 858,
    nrOfShards: 5,
    nrOfNodes: 100,
    blockNumber: 8833,
    roundNumber: 10539,
    roundTime: 6,
    averageBlockTxCount: 376,
    lastBlockTxCount: 987,
    totalProcessedTxCount: 3324341,
    shardID: 0,
    averageTPS: null,
    currentBlockNonce: 0,
  },
};

describe('Validators', () => {
  test('Validators page is displaying', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: heartbeatstatus }));
    const render = renderWithRouter({
      route: '/validators',
    });

    await wait(async () => {
      expect(document.title).toEqual('Validators • Elrond Explorer');
      expect(render.queryByTestId('title')!.innerHTML).toBe('Validators');
    });
  });
  test('Validators page loading state', async () => {
    const render = renderWithRouter({
      route: '/validators',
    });

    const loader = await render.findByTestId('loader');
    expect(loader).toBeInTheDocument();
  });
  test('Validators page failed state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockRejectedValueOnce(new Error('heartbeatstatus error'));

    const render = renderWithRouter({
      route: '/validators',
    });

    const failedState = await render.findByText('Unable to load validators');
    expect(failedState).toBeInTheDocument();
  });
});
