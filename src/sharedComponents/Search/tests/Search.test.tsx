import axios from 'axios';
import {
  fireEvent,
  renderWithRouter,
  wait,
  config as optionalConfig,
  meta,
  act,
} from 'utils/test-utils';
import {
  transactions as transactionsResponse,
  pendingTransaction,
  heartbeatstatus,
  statistics,
  validators,
  epoch,
  block,
  validatorsdoc,
} from 'utils/rawData';
import addressResponse from './rawData/address';
import ratings from './rawData/ratings';

const beforeAll = (fail = ['']) => {
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockImplementation((url: string): any => {
    console.log(url);
    switch (true) {
      // --- page load ---
      case url.includes('/tps/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: { data: heartbeatstatus, code: 'successful' } });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: { data: statistics, code: 'successful' } });
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      // --- page load ---
      case url.includes('validators'):
        return Promise.resolve({ data: validatorsdoc });
      case url.includes('network/status'):
        return Promise.resolve({ data: { data: epoch, code: 'successful' } });
      case url.includes('/ratingshistory/'):
        return Promise.resolve({ data: ratings });
      case url.includes('/address/') && !fail.includes('address'):
        return Promise.resolve({ data: { data: addressResponse, code: 'successful' } });
      case url.includes('/blocks') && !fail.includes('blocks'):
        return Promise.resolve({ data: block });
      case url.includes('/transactions/') && !fail.includes('transactions'):
        return Promise.resolve({ data: transactionsResponse });
      case url.includes('/transaction/') && !fail.includes('pendingTransaction'):
        return Promise.resolve({ data: { data: pendingTransaction, code: 'successful' } });
      default:
        return Promise.resolve(new Error('error'));
    }
  });
  return renderWithRouter({
    route: '/search',
    optionalConfig,
  });
};

describe('Search', () => {
  test('Seach finds validator', async () => {
    const render = beforeAll();

    const search = render.getByTestId('search');
    const data = {
      target: {
        value:
          '000523677f6c7f594de2452960c67411cb3503925d65124002edb2aefe125593c9bf588687655a04e4592ab4ade9911257581a71c44fa223752b2cfb7b8d43f1f9ef675d9513f3aa3ca6003118343e05269974848582e5141932be2c31aab582',
      },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    await wait(async () => {
      expect(searchButton).toBeEnabled();
    });
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Node Details • Elrond Explorer');
    });
  });
  test('Search finds block', async () => {
    const render = beforeAll();

    const search = render.getByTestId('search');
    const data = {
      target: { value: 'c51471d4b6a439af44c51bff7372c4f02a8c98ba3bf81e7e080fe461c074d1c1' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    await wait(async () => {
      expect(searchButton).toBeEnabled();
    });
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Search finds transaction', async () => {
    const render = beforeAll(['blocks']);

    const search = await render.findByTestId('search');
    const data = {
      target: { value: '41fa1461ac134ee095dbee60c3cc2848255181aaa2bdd6f5aae386d58e0d4a80' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    });
  });
  test('Search finds pending transaction', async () => {
    const render = beforeAll(['blocks', 'transactions', 'address']);

    const search = await render.findByTestId('search');
    const data = {
      target: { value: 'bfef4ed34748e13c01503ac317eff5612c629c807905afe9c73ace6e45d3fe91' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    });
  });
  test('Seach finds address', async () => {
    const render = beforeAll(['blocks', 'transactions', 'pendingTransaction']);

    const search = await render.findByTestId('search');
    const data = {
      target: { value: addressResponse.account.address },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Address Details • Elrond Explorer');
    });
  });
  test('Seach does not find anything', async () => {
    const render = beforeAll(['blocks', 'transactions', 'address', 'pendingTransaction']);

    const search = render.getByTestId('search');
    const data = {
      target: { value: 'random1234' },
    };
    fireEvent.change(search, data);

    const searchButton = await render.findByTestId('searchButton');
    fireEvent.click(searchButton);

    await act(async () => {
      await wait(async () => {
        expect(render.getByText('random1234').innerHTML).toBe('random1234');
      });
    });
  });
});
