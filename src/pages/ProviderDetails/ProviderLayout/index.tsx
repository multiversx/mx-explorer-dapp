import React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { useRouteMatch } from 'react-router-dom';

import { types, useIsMainnet, useNetworkRoute } from 'helpers';
import { IdentityType } from 'helpers/types';
import { validatorsRoutes } from 'routes';
import { adapter, Loader, PageState, SharedIdentity } from 'components';

import ProviderDetailsCard from './ProviderDetailsCard';

interface ProviderLayoutType<T> {
  data?: T;
  success: boolean | undefined;
}

const initialState = {
  success: undefined,
};

const ProviderLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const networkRoute = useNetworkRoute();
  const match: any = useRouteMatch(networkRoute(validatorsRoutes.providerDetails));
  const address = match ? match.params.hash : undefined;

  const { getProvider, getIdentity } = adapter();
  const isMainnet = useIsMainnet();

  const [provider, setProvider] = React.useState<ProviderLayoutType<types.ProviderType>>(
    initialState
  );
  const [identity, setIdentity] = React.useState<ProviderLayoutType<IdentityType>>(initialState);

  const fetchData = () => {
    getProvider({
      address,
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
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchData, []);

  const showIdentity =
    identity.success === false || (identity.success && identity.data !== undefined);

  return (
    <>
      {provider.success === undefined && <Loader />}
      {provider.success === false && (
        <PageState
          icon={faCode}
          title="Unable to load provider details"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      <div ref={ref}>
        {provider.success === true && (
          <div className="container page-content">
            {isMainnet && showIdentity && (
              <div className="row">
                <div className="col-12 mb-spacer">
                  <SharedIdentity.Summary
                    identity={identity.data}
                    featured={provider.data?.featured}
                  />
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-12 mb-spacer">
                <ProviderDetailsCard provider={provider.data} />
              </div>
            </div>

            <div className="row">
              <div className="col-12">{children}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProviderLayout;
