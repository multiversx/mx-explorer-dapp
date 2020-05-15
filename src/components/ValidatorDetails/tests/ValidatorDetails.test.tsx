import axios from 'axios';
import { fireEvent, renderWithRouter, wait, meta } from './../../../utils/test-utils';
import blocks from './rawData/blocks';
import heartbeatstatus from './rawData/heartbeatstatus';
import rounds from './rawData/rounds';
import doc from './rawData/doc';
import epoch from './rawData/epoch';
import statistics from './rawData/statistics';

export const beforeAll = () => {
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockImplementation((url: string): any => {
    switch (true) {
      case url.includes('/tps/_doc/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: heartbeatstatus });
      case url.includes('/node/epoch/1'):
        return Promise.resolve({ data: epoch });
      case url.includes('/validators/_doc/1_36'):
        return Promise.resolve({ data: doc });
      case url.includes('validator/statistics'):
        return Promise.resolve({ data: statistics });
    }
  });

  const mockPost = jest.spyOn(axios, 'post');
  mockPost.mockImplementation((url: string): any => {
    switch (true) {
      case url.includes('/rounds/_search'):
        return Promise.resolve({ data: rounds });
      case url.includes('/blocks/_search'):
        return Promise.resolve({ data: blocks });
    }
  });

  return renderWithRouter({
    route: `/validators/${heartbeatstatus.message[0].publicKey}`,
  });
};

describe('Node Information', () => {
  test('Node Information page displaying', async () => {
    const render = beforeAll();

    await wait(async () => {
      expect(document.title).toEqual('Validator Details • Elrond Explorer');
      expect(render.getByText('Node Information')).toBeDefined();
    });

    expect(render.getByTestId('versionNumber').innerHTML).toBe(
      'v1.0.115-0-g40e42e696-dirty/go1.13.5/linux-amd64'
    );

    expect(render.getByTestId('progresUpTimeBar').id).toBe('100.00% (2 days)100');
    expect(render.getByTestId('progresDownTimeBar').id).toBe('0.00% (a few seconds)0');

    await wait(async () => {
      expect(render.getByTestId('rounds').childElementCount).toBe(100);
    });

    await wait(async () => {
      expect(render.getByTestId('blocksTable').childElementCount).toBe(2);
    });
  });

  test('Node Information loading state', async () => {
    const render = renderWithRouter({
      route: `/validators/${heartbeatstatus.message[0].publicKey}`,
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

describe('Validator Details links', () => {
  test('Validator Details Shard link', async () => {
    const render = beforeAll();

    const shardLink = await render.findByTestId('shardLink');

    expect(shardLink.textContent).toBe('Shard 1');

    fireEvent.click(shardLink);

    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
});
