import axios from 'axios';
import { renderWithRouter, wait } from 'utils/test-utils';
import data from './blocks';

describe('Latest Blocks', () => {
  test('Latest Blocks component is displaying', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    const render = renderWithRouter({
      route: '/',
    });

    await wait(async () => {
      expect(render.queryByTestId('blocksList')!.childElementCount).toBe(20);
    });
  });
});
