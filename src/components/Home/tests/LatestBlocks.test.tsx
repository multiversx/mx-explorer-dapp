import { fireEvent, wait, beforeAll } from 'utils/test-utils';
import { blocks } from 'utils/rawData';

describe('Latest Blocks', () => {
  test('Latest Blocks component is displaying', async () => {
    const render = beforeAll({
      route: '/',
    });
    await wait(async () => {
      expect(render.queryByTestId('blocksList')!.childElementCount).toBe(25);
    });
  });

  test('Latest Blocks component loading state', async () => {
    const render = beforeAll({
      route: '/',
    });
    // correct way to get rid of not wrapped in act
    // https://stackoverflow.com/a/60164821/4264699
    // const blocksLoader = await waitForElement(() => render.queryByTestId('blocksLoader'));

    const blocksLoader = await render.findByTestId('blocksLoader');
    expect(blocksLoader).toBeDefined();
  });

  test('Latest Blocks component failing state', async () => {
    const render = beforeAll({
      route: '/',
      networkRequests: {
        blocks: () => Promise.resolve(new Error('error')),
      },
    });

    await wait(async () => {
      expect(render.queryByText('Unable to load blocks')).toBeDefined();
    });
  });
});

describe('Latest Blocks Links', () => {
  test('View All Blocks', async () => {
    const render = beforeAll({
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
    const render = beforeAll({
      route: '/',
    });

    const blockLink = await render.findByTestId('blockLink0');
    expect(blockLink).toBeInTheDocument();

    expect(blockLink.innerHTML).toBe(blocks[0].nonce.toString());
    fireEvent.click(blockLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Latest Blocks Hash Link', async () => {
    const render = beforeAll({
      route: '/',
    });

    const blockHashLink = await render.findByTestId('blockHashLink0');
    expect(blockHashLink).toBeInTheDocument();

    expect(blockHashLink.textContent).toContain(
      'f2b1bc5b74c6d0bc7730e18a7f6a4a890820cba85aef4562f11b8100d618004a'
    );
    fireEvent.click(blockHashLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
