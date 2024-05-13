import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SHARE_PREFIX } from 'config';
import { capitalize } from 'helpers';
import { MetaTagsType } from 'types/metaTags.types';

const DEFAULT_TITLE = `MultiversX${
  SHARE_PREFIX ? ` ${capitalize(SHARE_PREFIX)}` : ''
} Explorer`;
const DEFAULT_DESCRIPTION =
  'A highly scalable, fast and secure blockchain platform for distributed apps, enterprise use cases and the new internet economy.';
const DEFAULT_PREVIEW = `https://${process.env.VITE_APP_SHARE_PREFIX}explorer.multiversx.com/${process.env.VITE_APP_SHARE_PREFIX}share.jpg`;

export const getInitialMetaTagsState = (): MetaTagsType => {
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    preview: DEFAULT_PREVIEW
  };
};

export const metaTagsSlice = createSlice({
  name: 'metaTagsSlice',
  initialState: getInitialMetaTagsState(),
  reducers: {
    setMetaTags: (state: MetaTagsType, action: PayloadAction<MetaTagsType>) => {
      state.pageName = action.payload.pageName ?? state.pageName;
      state.pageDetails = action.payload.pageDetails;
      state.description = action.payload.description ?? DEFAULT_DESCRIPTION;
      state.preview = action.payload.preview ?? DEFAULT_PREVIEW;
    }
  }
});

export const { setMetaTags } = metaTagsSlice.actions;

export const metaTagsReducer = metaTagsSlice.reducer;
