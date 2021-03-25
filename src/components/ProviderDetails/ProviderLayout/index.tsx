import React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { adapter, Loader, PageState } from 'sharedComponents';
import { useRouteMatch } from 'react-router-dom';
import { SharedIdentity } from 'sharedComponents';
import { types, useIsMainnet } from 'helpers';
import ProviderDetailsCard from './ProviderDetailsCard';
import { providerRoutes } from 'routes';
import { IdentityType } from 'context/state';

const ProviderLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const match: any = useRouteMatch(providerRoutes.index);
  const address = match ? match.params.hash : undefined;
  const { getProvider, getIdentity } = adapter();
  const isMainnet = useIsMainnet();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const [provider, setProvider] = React.useState<types.ProviderType>();
  const [identity, setIdentity] = React.useState<IdentityType>();

  const fetchData = () => {
    getProvider({ address }).then(({ success, data }) => {
      if (ref.current !== null) {
        if (success) {
          if (data.identity) {
            getIdentity(data.identity).then((identityData) => {
              if (ref.current !== null) {
                if (identityData.success) {
                  setIdentity(identityData.data);
                }
                setProvider(data);
                setDataReady(success);
              }
            });
          } else {
            setProvider(data);
            setDataReady(success);
          }
        } else {
          setDataReady(success);
        }
      }
    });
  };

  React.useEffect(fetchData, []);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCode}
          title="Unable to load provider details"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      <div ref={ref}>
        {dataReady === true && (
          <div className="container page-content">
            {isMainnet && provider && identity !== undefined && (
              <div className="row">
                <div className="col-12 mb-spacer">
                  <SharedIdentity.Summary identity={identity} />
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-12 mb-spacer">
                <ProviderDetailsCard provider={provider} />
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
