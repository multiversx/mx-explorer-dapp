import axios from 'axios';
import { fireEvent, renderWithRouter, wait } from './../../../utils/test-utils';
import blocks from './blocks';
import heartbeatstatus from './heartbeatstatus';
import meta from './meta';
import rounds from './rounds';
import validators from './validators';

describe('Node Information', () => {
  test('Node Information page displaying', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockImplementation((url: string): any => {
      switch (true) {
        case url.includes('/tps/_doc/meta'):
          return Promise.resolve({ data: meta });
        case url.includes(`/node/heartbeatstatus`):
          return Promise.resolve({ data: heartbeatstatus });
        case url.includes('/validators/_search'):
          return Promise.resolve({ data: validators });
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

    await wait(async () => {
      expect(render.getByTestId('blocksTable').childElementCount).toBe(25);
    });
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

describe('Validator Details links', () => {
  test('Validator Details Shard link', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockImplementation((url: string): any => {
      switch (true) {
        case url.includes('/tps/_doc/meta'):
          return Promise.resolve({ data: meta });
        case url.includes(`/node/heartbeatstatus`):
          return Promise.resolve({ data: heartbeatstatus });
        case url.includes('/validators/_search'):
          return Promise.resolve({ data: validators });
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

    const render = renderWithRouter({
      route: `/validators/${heartbeatstatus.message[0].hexPublicKey}`,
    });

    const shardLink = await render.findByTestId('shardLink');

    expect(shardLink.textContent).toBe('Metachain');

    fireEvent.click(shardLink);

    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
});
