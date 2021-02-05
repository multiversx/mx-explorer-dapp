import { fireEvent, wait, beforeAll } from 'utils/test-utils';
import { miniblock, account, node, tokenDetails } from 'utils/rawData';

describe('Search input', () => {
  test('Search finds block', async () => {
    const render = beforeAll({
      route: '/search',
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: 'c51471d4b6a439af44c51bff7372c4f02a8c98ba3bf81e7e080fe461c074d1c1' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    await wait(async () => {
      expect(searchButton).toBeEnabled();
    });
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Search finds transaction', async () => {
    const render = beforeAll({
      route: '/search',
      networkRequests: {
        block: () => Promise.resolve(new Error('error')),
      },
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: '41fa1461ac134ee095dbee60c3cc2848255181aaa2bdd6f5aae386d58e0d4a80' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    });
  });
  test('Search finds miniblock', async () => {
    const render = beforeAll({
      route: '/search',
      networkRequests: {
        block: () => Promise.resolve(new Error('error')),
        transaction: () => Promise.resolve(new Error('error')),
      },
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: miniblock.miniBlockHash },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Miniblock Details • Elrond Explorer');
    });
  });
  test('Search finds account', async () => {
    const render = beforeAll({
      route: '/search',
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: account.address },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Account Details • Elrond Explorer');
    });
  });
  test('Search finds username', async () => {
    const render = beforeAll({
      route: '/search',
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: account.username },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Account Details • Elrond Explorer');
    });
  });
  test('Search finds node', async () => {
    const render = beforeAll({
      route: '/search',
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: node.publicKey },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Node Details • Elrond Explorer');
    });
  });
  // TODO enable when tokens go live
  // test('Search finds token', async () => {
  //   const render = beforeAll({
  //     route: '/search',
  //   });

  //   const search = render.getAllByTestId('search')[0];
  //   const data = {
  //     target: { value: tokenDetails.tokenIdentifier },
  //   };
  //   fireEvent.change(search, data);

  //   const searchButton = render.getAllByTestId('searchButton')[0];
  //   fireEvent.click(searchButton);

  //   await wait(async () => {
  //     expect(document.title).toEqual('Token Details • Elrond Explorer');
  //   });
  // });
  test('Search does not find anything', async () => {
    const render = beforeAll({
      route: '/search',
      networkRequests: {
        username: () => Promise.resolve(new Error('error')),
      },
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: 'random1234' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(render.getByText('random1234')).toBeDefined();
    });
  });
});
