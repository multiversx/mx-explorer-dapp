import axios from 'axios';
import { fireEvent, renderWithRouter, wait } from '../../../utils/test-utils';
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

const goToValidatorsPage = () => {
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
  mockGet.mockReturnValueOnce(Promise.resolve({ data: heartbeatstatus }));
  return renderWithRouter({
    route: '/validators',
  });
};

describe('Validators', () => {
  test('Validators page is displaying', async () => {
    const render = goToValidatorsPage();
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

describe('Validators filters', () => {
  test('Include observers working', async () => {
    const render = goToValidatorsPage();

    const totalPages = await render.findByTestId('totalPages');
    expect(totalPages.textContent).toBe('412');

    const checkbox = render.getByTestId('includeObservers');
    fireEvent.click(checkbox);

    expect(totalPages.textContent).toBe('474');
  });
  test('Filter by observers working', async () => {
    if (document) {
      (document.createRange as any) = () => ({
        setStart: () => null,
        setEnd: () => null,
        commonAncestorContainer: {
          nodeName: 'BODY',
          ownerDocument: document,
        },
      });
    }

    const render = goToValidatorsPage();

    const checkbox = await render.findByTestId('includeObservers');
    fireEvent.click(checkbox);

    const filter = await render.findByTestId('filterValidatorObserver');
    fireEvent.click(filter);

    const filterByObservers = await render.findByTestId('filterByObservers');

    fireEvent.click(filterByObservers);

    const totalPages = render.getByTestId('totalPages');
    expect(totalPages.textContent).toBe('62');
  });
  test('Validator search working', async () => {
    const render = goToValidatorsPage();

    const searchInput = await render.findByTestId('validatorSearch');
    const data = { target: { value: 'bonw' } };
    fireEvent.change(searchInput, data);

    const totalPages = await render.findByTestId('totalPages');
    expect(totalPages.textContent).toBe('124');

    const resetSearch = await render.findByTestId('resetSearch');
    fireEvent.click(resetSearch);

    expect(totalPages.textContent).toBe('412');
  });
  test('Filter by shard working', async () => {
    const render = goToValidatorsPage();

    const searchInput = await render.findByTestId('validatorSearch');
    const data = { target: { value: 'bonw' } };
    fireEvent.change(searchInput, data);

    const totalPages = await render.findByTestId('totalPages');
    expect(totalPages.textContent).toBe('124');

    const resetSearch = await render.findByTestId('resetSearch');
    fireEvent.click(resetSearch);

    expect(totalPages.textContent).toBe('412');
  });
});
