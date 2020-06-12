import axios from 'axios';
import { wait } from 'utils/test-utils';
import { beforeAll } from './ValidatorDetails.test';

describe('Rounds', () => {
  test('Rounds failed state', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValueOnce(new Error('rounds error'));

    const render = beforeAll();

    await wait(async () => {
      expect(render.getByTestId('roundsErrorScreen')).toBeDefined();
    });
  });
});
