import { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';

import { NODE_STATUS_PREVIEW_FIELDS, MAX_RESULTS } from 'appConstants';
import {
  Loader,
  PageState,
  SharedIdentity,
  NodesStatusPreview
} from 'components';
import { useAdapter, useIsMainnet } from 'hooks';
import { faCode } from 'icons/regular';
import {
  IdentityType,
  NodeTypeEnum,
  ProviderType,
  NodeStatusPreviewType
} from 'types';

import { ProviderDetailsCard } from './ProviderDetailsCard';

export const ProviderLayout = () => {
  const { hash: address } = useParams();
  const { getProvider, getIdentity, getNodes } = useAdapter();
  const isMainnet = useIsMainnet();

  const [provider, setProvider] = useState<ProviderType>();
  const [identity, setIdentity] = useState<IdentityType>();
  const [providerNodes, setProviderNodes] = useState<NodeStatusPreviewType[]>(
    []
  );
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchProvider = async () => {
    if (address) {
      const { data, success } = await getProvider({ address });
      if (success && data) {
        const [identityDetails, providerNodesDetails] = await Promise.all([
          getIdentity(data.identity),
          getNodes({
            provider: data.provider,
            type: NodeTypeEnum.validator,
            fields: NODE_STATUS_PREVIEW_FIELDS.join(','),
            size: MAX_RESULTS
          })
        ]);
        if (identityDetails.success) {
          setIdentity(identityDetails.data);
        }
        if (providerNodesDetails.success) {
          setProviderNodes(providerNodesDetails.data);
        }
      }

      setProvider(data);
      setDataReady(success);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, []);

  dataReady === undefined && <Loader />;
  dataReady === false && (
    <PageState icon={faCode} title='Unable to load Provider details' isError />
  );

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
          <NodesStatusPreview nodes={providerNodes} />
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
