import axios from 'axios';
import { renderWithRouter, wait } from './../../../utils/test-utils';

describe('Blocks', () => {
  test('Blocks page is displaying', () => {
    const render = renderWithRouter({
      route: '/blocks',
    });
    expect(render.queryByTestId('title')!.innerHTML).toBe('Blocks');
  });
  test('Blocks page failed message', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValueOnce(new Error('the error'));

    const render = renderWithRouter({
      route: '/blocks',
    });

    await wait(async () => {
      const failedBlocks = await render.findByTestId('failedBlocks');
      expect(failedBlocks.innerHTML).toBeDefined();
    });
  });
});
