import axios from 'axios';
import { renderWithRouter, wait, meta } from './../../../utils/test-utils';
import heartbeatstatus from './rawData/heartbeatstatus';
import { beforeAll } from './ValidatorDetails.test';

describe('Rounds', () => {
  test('Rounds loading state', async () => {
    const render = beforeAll();
    const loader = await render.findByTestId('roundsLoading');
    expect(loader).toBeDefined();
  });
  test('Rounds failed state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    const mockPost = jest.spyOn(axios, 'post');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: heartbeatstatus }));
    // mockGet.mockReturnValueOnce(Promise.resolve({ data: validators }));
    mockPost.mockRejectedValueOnce(new Error('rounds error'));

    const render = renderWithRouter({
      route: `/validators/${heartbeatstatus.message[0].publicKey}`,
    });
    await wait(async () => {
      expect(render.getByTestId('roundsErrorScreen')).toBeDefined();
    });
  });
});
