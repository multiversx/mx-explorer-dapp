import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import {
  useNetworkRoute,
  urlBuilder,
  useIsMainnet,
  isHash,
  addressIsBech32,
  bech32,
} from 'helpers';
import { Redirect, useParams } from 'react-router-dom';
import { adapter, PageState } from 'sharedComponents';

const HashSearch = () => {
  const { hash: query } = useParams() as any;
  const isMainnet = useIsMainnet();
  const networkRoute = useNetworkRoute();
  const { getAccount, getBlock, getTransaction, getNode, getMiniBlock, getToken } = adapter();
  const [route, setRoute] = React.useState('');
  const [searching, setSearching] = React.useState(false);

  const checkQuery = async () => {
    if (Boolean(query)) {
      setSearching(true);
      const validqueryChars = /^[0-9A-Fa-f]+$/i;

      const isAccount = addressIsBech32(query);
      const isValidquery = isHash(query);
      const isNode = validqueryChars.test(query) === true && query.length === 192;
      const isToken =
        query.includes('-') &&
        query.split('-')[1].length === 6 &&
        validqueryChars.test(query.split('-')[1]) === true;

      let isPubKeyAccount = false;
      try {
        isPubKeyAccount = query.length < 65 && addressIsBech32(bech32.encode(query));
      } catch {}

      switch (true) {
        case isAccount:
          getAccount(query).then((account) => {
            const newRoute = account.success ? networkRoute(urlBuilder.accountDetails(query)) : '';
            setRoute(newRoute);
            setSearching(false);
          });
          break;

        case isNode:
          getNode(query).then((node) => {
            const newRoute = node.success ? networkRoute(urlBuilder.nodeDetails(query)) : '';
            setRoute(newRoute);
            setSearching(false);
          });
          break;

        case isToken:
          if (isMainnet) {
            setRoute('');
          } else {
            getToken(query).then((token) => {
              const newRoute = token.success ? networkRoute(urlBuilder.tokenDetails(query)) : '';
              setRoute(newRoute);
              setSearching(false);
            });
          }
          break;

        case isValidquery:
          Promise.all([getBlock(query), getTransaction(query), getMiniBlock(query)]).then(
            ([block, transaction, miniblock]) => {
              switch (true) {
                case block.success:
                  setRoute(networkRoute(`/blocks/${query}`));
                  break;
                case transaction.success:
                  setRoute(networkRoute(`/transactions/${query}`));
                  break;
                case miniblock.success:
                  setRoute(networkRoute(`/miniblocks/${query}`));
                  break;
                default:
                  setRoute('');
                  break;
              }
              setSearching(false);
            }
          );
          if (isPubKeyAccount) {
            getAccount(bech32.encode(query)).then((account) => {
              const newRoute = account.success
                ? networkRoute(urlBuilder.accountDetails(bech32.encode(query)))
                : '';
              setRoute(newRoute);
            });
          }
          break;

        default:
          setRoute('');
          break;
      }
    }
  };

  React.useEffect(() => {
    checkQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {searching ? (
        <PageState
          icon={faSearch}
          title="Searching..."
          description={
            <div className="px-spacer">
              <span className="text-break-all">{query}</span>
            </div>
          }
          className="py-spacer m-auto"
          dataTestId="searchScreen"
        />
      ) : (
        <>
          {route ? (
            <Redirect to={route} />
          ) : (
            <PageState
              icon={faSearch}
              title="Your search does not match anything we've got"
              description={
                <div className="px-spacer">
                  <span className="text-break-all">{query}</span>
                </div>
              }
              className="py-spacer m-auto"
              dataTestId="errorScreen"
            />
          )}
        </>
      )}
    </>
  );
};

export default HashSearch;
