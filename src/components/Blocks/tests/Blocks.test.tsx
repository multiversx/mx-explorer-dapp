import axios from 'axios';
import { renderWithRouter } from 'utils/test-utils';

describe('Blocks', () => {
  test('Blocks page is displaying', () => {
    const render = renderWithRouter({
      route: '/blocks',
    });
    expect(render.queryByTestId('title')!.innerHTML).toBe('Blocks');
    expect(document.title).toEqual('Blocks • Elrond Explorer');
  });
  test('Blocks page loading state', async () => {
    const render = renderWithRouter({
      route: '/blocks',
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });
  test('Blocks page failed state', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValueOnce(new Error('the error'));

    const render = renderWithRouter({
      route: '/blocks',
    });

    const failedState = await render.findByText('Unable to load blocks');
    expect(failedState.innerHTML).toBeDefined();
  });
});
