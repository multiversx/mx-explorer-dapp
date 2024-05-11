import { useEffect, useState } from 'react';

import {
  Loader,
  PageState,
  AuctionListCards,
  AuctionListFilters,
  AuctionListTable
} from 'components';

import { useAdapter, useGetNodeFilters } from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { AuctionValidatorType } from 'types';

export const NodesAuctionList = () => {
  const { getAuctionNodes } = useAdapter();
  const nodeFilters = useGetNodeFilters();

  const [auctionListValidators, setAuctionListValidators] = useState<
    AuctionValidatorType[]
  >([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  let filterText = '';
  if (!nodeFilters.isQualified) {
    filterText = 'Unqualified';
  }
  if (nodeFilters.isQualified) {
    filterText = 'Qualified';
  }
  if (nodeFilters.isAuctionDangerZone) {
    filterText = 'Danger Zone';
  }
  if (Object.keys(nodeFilters).length === 0) {
    filterText = '';
  }

  const fetcAuctionListValidators = () => {
    setDataReady(undefined);
    getAuctionNodes({}).then(({ data, success }) => {
      if (success) {
        setAuctionListValidators(data);
      }
      setDataReady(success);
    });
  };

  useEffect(fetcAuctionListValidators, []);

  return (
    <div className='card nodes-auction-list'>
      <div className='card-header'>
        <NodesTabs />
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AuctionListCards />
          <AuctionListFilters />
        </div>
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to load Auction List' isError />
      )}
      {dataReady === true && auctionListValidators.length === 0 && (
        <PageState
          icon={faCogs}
          title={`No ${
            filterText ? `${filterText} ` : ''
          }Nodes in Auction List`}
        />
      )}

      {dataReady === true && auctionListValidators.length > 0 && (
        <div className='card-body'>
          <AuctionListTable auctionListValidators={auctionListValidators} />
        </div>
      )}
    </div>
  );
};
