import axios from 'axios';
import { renderWithRouter, wait, meta } from '../../../utils/test-utils';
import blocks from './blocks';
import doc from './doc';
import validators from './validators';

describe('Block Details', () => {
  test('Block Details page is displaying', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockImplementation((url: string): any => {
      switch (true) {
        case url.includes('/tps/_doc/meta'):
          return Promise.resolve({ data: meta });
        case url.includes(`/blocks/_doc/${doc._id}`):
          return Promise.resolve({ data: doc });
        case url.includes('/validators/_search'):
          return Promise.resolve({ data: validators });
      }
    });
    mockPost.mockReturnValueOnce(Promise.resolve({ data: blocks }));

    const render = renderWithRouter({
      route: `/blocks/${doc._id}`,
    });
    expect(document.title).toEqual('Block Details • Elrond Explorer');
    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Block Details');
    });
    expect(render.getByText(doc._source.nonce.toString())).toBeInTheDocument();
  });
  test('Block Details page loading state', async () => {
    const render = renderWithRouter({
      route: `/blocks/${doc._id}`,
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });
  test('Block Details page failed state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockRejectedValueOnce(new Error('doc error'));

    const render = renderWithRouter({
      route: `/blocks/${doc._id}`,
    });

    const failedState = await render.findByText('Unable to locate this block hash');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Block Details Links', () => {
  test('Block Details page is displaying', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: doc }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: validators }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: blocks }));

    const render = renderWithRouter({
      route: `/blocks/${doc._id}`,
    });
    expect(document.title).toEqual('Block Details • Elrond Explorer');
    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Block Details');
    });

    expect(render.getByText(doc._source.nonce.toString())).toBeInTheDocument();
  });
});
