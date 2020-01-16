import axios from 'axios';
import { renderWithRouter, wait } from './../../../utils/test-utils';
import blocks from './blocks';
import heartbeatstatus from './heartbeatstatus';
import meta from './meta';
import rounds from './rounds';
import validators from './validators';

describe('Node Information', () => {
  test('Node Information page displaying', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: heartbeatstatus }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: validators }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: rounds }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: blocks }));

    const render = renderWithRouter({
      route: `/validators/${heartbeatstatus.message[0].hexPublicKey}`,
    });

    await wait(async () => {
      expect(document.title).toEqual('Validator Details • Elrond Explorer');
      expect(render.getByText('Node Information')).toBeDefined();
    });

    expect(render.getByTestId('versionNumber').innerHTML).toBe(
      'v1.0.77-0-g9d8013a8/go1.13.5/linux-amd64'
    );

    expect(render.getByTestId('progresUpTimeBar').id).toBe('70.00% (12 minutes)70');
    expect(render.getByTestId('progresDownTimeBar').id).toBe('30.00% (5 minutes)30');

    await wait(async () => {
      expect(render.getByTestId('rounds').childElementCount).toBe(100);
    });

    expect(render.getByTestId('blocksTable').childElementCount).toBe(3);
  });

  test('Node Information loading state', async () => {
    const render = renderWithRouter({
      route: `/validators/${heartbeatstatus.message[0].hexPublicKey}`,
    });
    expect(render.getByTestId('loader')).toBeDefined();
  });

  test('Node Information failed state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockRejectedValueOnce(new Error('meta error'));
    mockGet.mockRejectedValueOnce(new Error('heartbeatstatus error'));
    // mockGet.mockRejectedValueOnce(new Error('validators error'));
    // mockGet.mockRejectedValueOnce(new Error('rounds error'));
    const render = renderWithRouter({
      route: `/validators/123`,
    });
    await wait(async () => {
      expect(render.getByTestId('errorScreen')).toBeDefined();
    });
  });
});
