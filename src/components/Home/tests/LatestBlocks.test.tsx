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
  test('Block Hash Link', async () => {
    const render = beforeAll({
      route: '/',
    });

    const blockHashLink = await render.findByTestId('blockHashLink0');
    expect(blockHashLink).toBeInTheDocument();

    expect(blockHashLink.innerHTML).toBe(
      '7d6df53015199a0991bc03cb8c60c8084dce5ead1a60c7eadafa4dfcf9990698'
    );
    fireEvent.click(blockHashLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
