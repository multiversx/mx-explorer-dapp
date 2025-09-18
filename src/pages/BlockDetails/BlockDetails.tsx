import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { isHash } from 'helpers';
import { useAdapter, useNetworkRoute } from 'hooks';
import { faCube } from 'icons/regular';
import { UIBlockType } from 'types';

import { BlockData } from './components/BlockData';

export const BlockDetails = () => {
  const networkRoute = useNetworkRoute();
  const { getBlock, getBlocks } = useAdapter();
  const { hash: blockId } = useParams() as any;

  const [block, setBlock] = useState<UIBlockType>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const invalid = blockId && !isHash(blockId);

  const fetchBlock = async () => {
    const { success, data } = await getBlock(blockId);
    if (success && data?.nonce && data?.shard !== undefined) {
      const { data: blocksData } = await getBlocks({
        nonce: data.nonce + 1,
        shard: data.shard,
        withProposerIdentity: false,
        size: 1,
        fields: 'hash'
      });
      const nextHash = blocksData?.[0]?.hash;

      if (nextHash) {
        setBlock({ ...data, nextHash });
        setDataReady(success);
        return;
      }
    }

    setBlock(block);
    setDataReady(success);
  };

  useEffect(() => {
    if (!invalid) {
      fetchBlock();
    }
  }, [blockId, invalid]);

  if (invalid) {
    return <Navigate to={networkRoute('/not-found')} />;
  }

  if (dataReady === undefined) {
    return <Loader />;
  }

  if (dataReady === false || !block) {
    return (
      <PageState
        icon={faCube}
        title='Unable to locate this block hash'
        description={
          <div className='px-spacer'>
            <span className='text-break-all'>{blockId}</span>
          </div>
        }
        isError
      />
    );
  }

  return (
    <div className='container page-content'>
      <div className='row'>
        <div className='col-12'>
          <BlockData block={block} />
        </div>
      </div>
    </div>
  );
};
