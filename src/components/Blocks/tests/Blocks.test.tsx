import axios from 'axios';
import { renderWithRouter } from './../../../utils/test-utils';

describe('Blocks', () => {
  test('Blocks page is displaying', () => {
    const render = renderWithRouter({
      route: '/blocks',
    });
    expect(render.queryByTestId('title')!.innerHTML).toBe('Blocks');
  });
  test('Blocks page loading state', async () => {
    const render = renderWithRouter({
      route: '/blocks',
    });

    const failedBlocks = await render.findByTestId('loader');
    expect(failedBlocks.innerHTML).toBeDefined();
  });
  test('Blocks page failed state', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValueOnce(new Error('the error'));

    const render = renderWithRouter({
      route: '/blocks',
    });

    const failedBlocks = await render.findByText('Unable to load blocks');
    expect(failedBlocks.innerHTML).toBeDefined();
  });
});
