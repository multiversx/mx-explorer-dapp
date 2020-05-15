import axios from 'axios';
import { renderWithRouter, wait, meta } from './../../../utils/test-utils';

const doc = {
  _index: 'transactions',
  _type: '_doc',
  _id: '74b80b0d2d79172d193aa8e3613806db1ae7a3ca3bfbe56d2f1507fcd9bc97b4',
  _version: 1,
  _seq_no: 675003,
  _primary_term: 1,
  found: true,
  _source: {
    hash: '74b80b0d2d79172d193aa8e3613806db1ae7a3ca3bfbe56d2f1507fcd9bc97b4',
    miniBlockHash: '93762910edf44a1297e28bb3a7ba101b9398e1145bc5055d8aadc7a342ea4e0f',
    blockHash: 'd9afb04206194cea67632fbee776585529704cb36c456d14116880a92d99907a',
    nonce: 0,
    round: 10721,
    value: '20000000000000000000',
    receiver: '3dfc2db7150207e6e8c2a40da79073f401838e336f9f3a34f32c1e75fb89d8d3',
    sender: 'Shard3',
    receiverShard: 3,
    senderShard: 3,
    gasPrice: 0,
    gasLimit: 0,
    data: '',
    signature: '',
    timestamp: 1579096326,
    status: 'Success',
  },
};

describe('Transaction Details', () => {
  test('Transaction Details page is displaying', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: doc }));
    const render = renderWithRouter({
      route: `/transactions/${doc._source.hash}`,
    });
    expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    await wait(async () => {
      expect(render.getByText(doc._source.hash)).toBeInTheDocument();
    });
  });

  test('Transaction Details loading state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: doc }));
    const render = renderWithRouter({
      route: `/transactions/${doc._source.hash}`,
    });
    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Transaction Details failed state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockRejectedValueOnce(new Error('doc error'));

    const render = renderWithRouter({
      route: `/transactions/${doc._source.hash}`,
    });
    const failedScreen = await render.findByText('Unable to locate this transaction hash');
    expect(failedScreen.innerHTML).toBeDefined();
  });
});
