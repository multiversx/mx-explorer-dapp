import { useEffect, useRef, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';

import { Loader, PageState, SharedIdentity } from 'components';
import { useAdapter, useIsMainnet } from 'hooks';
import { faCode } from 'icons/regular';
import { IdentityType, ProviderType } from 'types';

import { ProviderDetailsCard } from './ProviderDetailsCard';

interface ProviderLayoutType<T> {
  data?: T;
  success: boolean | undefined;
}

const initialState = {
  success: undefined
};

export const ProviderLayout = () => {
  const ref = useRef(null);
  const { hash: address } = useParams();

  const { getProvider, getIdentity } = useAdapter();
  const isMainnet = useIsMainnet();

  const [provider, setProvider] =
    useState<ProviderLayoutType<ProviderType>>(initialState);
  const [identity, setIdentity] =
    useState<ProviderLayoutType<IdentityType>>(initialState);

  const fetchData = () => {
    if (address) {
      getProvider({
        address
      }).then((providerData) => {
        if (ref.current !== null) {
          if (providerData.success) {
            if (providerData.data.identity) {
              getIdentity(providerData.data.identity).then((identityData) => {
                if (ref.current !== null) {
                  if (identityData.success) {
                    setIdentity(identityData);
                  }
                  setProvider(providerData);
                }
              });
            } else {
              setProvider(providerData);
            }
          } else {
            setProvider(providerData);
          }
        }
      });
    }
  };

  useEffect(fetchData, []);

  const showIdentity =
    identity.success === false ||
    (identity.success && identity.data !== undefined);

  return (
    <>
      {provider.success === undefined && <Loader />}
      {provider.success === false && (
        <PageState
          icon={faCode}
          title='Unable to load provider details'
          isError
        />
      )}
      <div ref={ref}>
        {provider.success === true && (
          <div className='container page-content'>
            {isMainnet && showIdentity && (
              <div className='row'>
                <div className='col-12 mb-3'>
                  <SharedIdentity.Summary
                    identity={identity.data}
                    featured={provider.data?.featured}
                  />
                </div>
              </div>
            )}

            <div className='row'>
              <div className='col-12 mb-3'>
                <ProviderDetailsCard provider={provider.data} />
              </div>
            </div>

            <div className='row'>
              <div className='col-12'>
                <Outlet />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
