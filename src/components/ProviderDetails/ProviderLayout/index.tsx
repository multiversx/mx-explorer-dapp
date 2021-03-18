import React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { adapter, Loader, PageState } from 'sharedComponents';
import { useRouteMatch } from 'react-router-dom';
import { SharedIdentity } from 'sharedComponents';
import { types } from 'helpers';
import ProviderDetailsCard from './ProviderDetailsCard';
import { providerRoutes } from 'routes';

const ProviderLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const match: any = useRouteMatch(providerRoutes.index);
  const address = match ? match.params.hash : undefined;
  const { getProvider } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const [provider, setProvider] = React.useState<types.ProviderType>();

  const fetchData = () => {
    getProvider(address).then(({ success, data }) => {
      if (ref.current !== null) {
        // setProvider(data);
        // setDataReady(success);

        setProvider({
          contract: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l',
          serviceFee: '12',
          withDelegationCap: true,
          maxDelegationCap: '100',
          apr: '29',
          totalActiveStake: '2250000000000000000000000',
          numUsers: 4,
          numNodes: 20,
          identity: {
            name: 'Just Mining',
            avatar:
              'https://s3.amazonaws.com/keybase_processed_uploads/b011b27c59f42344b38b476da9d85105_360_360.jpg',
            identity: 'thomasjustmining',
            location: 'Craiova, Romania',
            twitter: 'https://twitter.com/just_mining',
            validators: 1454,
            score: 174480,
            stake: 3635000,
            stakePercent: 67.04,
          },
        });

        setDataReady(true);
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
          <div className="container pt-spacer">
            {provider && provider.identity !== undefined && (
              <div className="row">
                <div className="col-12 mb-spacer">
                  <SharedIdentity.Summary identity={provider.identity} />
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
