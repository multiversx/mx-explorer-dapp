import * as React from 'react';
import { faPalette } from '@fortawesome/pro-regular-svg-icons/faPalette';
import { PageState } from 'sharedComponents';

export default function NoNfts() {
  return <PageState icon={faPalette} title="No NFTs" className="py-spacer my-auto" />;
}
