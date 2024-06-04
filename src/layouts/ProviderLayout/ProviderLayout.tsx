import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Outlet } from 'react-router-dom';

import { NODE_STATUS_PREVIEW_FIELDS, MAX_RESULTS } from 'appConstants';
import { Loader, NodesOverview, PageState, SharedIdentity } from 'components';
import {
  useAdapter,
  useIsMainnet,
  useFetchStake,
  useFetchNodesOverview
} from 'hooks';
import { faCode } from 'icons/regular';
import { nodesOverviewSelector } from 'redux/selectors';
import { IdentityType, NodeTypeEnum, ProviderType } from 'types';

import { ProviderDetailsCard } from './ProviderDetailsCard';

export const ProviderLayout = () => {
  const { isFetched: isNodesOverviewFetched } = useSelector(
    nodesOverviewSelector
  );
  const { hash: address } = useParams();
  const { getProvider, getIdentity } = useAdapter();
  const isMainnet = useIsMainnet();

  const [provider, setProvider] = useState<ProviderType>();
  const [identity, setIdentity] = useState<IdentityType>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  useFetchStake();
  useFetchNodesOverview({
    provider: address,
    type: NodeTypeEnum.validator,
    fields: NODE_STATUS_PREVIEW_FIELDS.join(','),
    size: MAX_RESULTS
  });

  const fetchProvider = async () => {
    if (address) {
      const { data, success } = await getProvider({ address });
      if (success && data) {
        const identityDetails = await getIdentity(data.identity);
        if (identityDetails.success) {
          setIdentity(identityDetails.data);
        }
      }

      setProvider(data);
      setDataReady(success);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, []);

  if (dataReady === undefined || !isNodesOverviewFetched) {
    return <Loader />;
  }
  if (dataReady === false) {
    return (
      <PageState
        icon={faCode}
        title='Unable to load Provider details'
        isError
      />
    );
  }

  return (
    <div className='container page-content'>
      {isMainnet && identity && (
        <div className='row'>
          <div className='col-12 mb-3'>
            <SharedIdentity.Summary
              identity={identity}
              featured={provider?.featured}
            />
          </div>
        </div>
      )}
      <div className='row'>
        <div className='col-12 mb-3'>
          <ProviderDetailsCard provider={provider} />
        </div>
      </div>
      <div className='row'>
        <div className='col-12 mb-3'>
          <div className='card'>
            <div className='card-body'>
              <NodesOverview />
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
