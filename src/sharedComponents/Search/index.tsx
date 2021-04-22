import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faCircleNotch } from '@fortawesome/pro-regular-svg-icons/faCircleNotch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetworkRoute, urlBuilder, useIsMainnet, isHash, addressIsBech32 } from 'helpers';
import { Redirect, useLocation } from 'react-router-dom';
import { adapter } from 'sharedComponents';

interface SearchType {
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = ({ setExpanded = () => null }: SearchType) => {
  const { pathname } = useLocation();
  const isMainnet = useIsMainnet();
  const networkRoute = useNetworkRoute();
  const { getAccount, getBlock, getTransaction, getNode, getMiniBlock, getToken } = adapter();
  const [route, setRoute] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const [hash, setHash] = React.useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  const notFoundRoute = networkRoute(`/search/${hash}`);

  const onClick = async () => {
    if (Boolean(hash)) {
      setSearching(true);
      const validHashChars = /^[0-9A-Fa-f]+$/i;

      const isAccount = addressIsBech32(hash);
      const isValidHash = isHash(hash);
      const isNode = validHashChars.test(hash) === true && hash.length === 192;
      const isToken =
        hash.includes('-') &&
        hash.split('-')[1].length === 6 &&
        validHashChars.test(hash.split('-')[1]) === true;

      switch (true) {
        case isAccount:
          getAccount(hash).then((account) => {
            setExpanded(false);
            const newRoute = account.success
              ? networkRoute(urlBuilder.accountDetails(hash))
              : notFoundRoute;
            setRoute(newRoute);
          });
          break;

        case isNode:
          getNode(hash).then((node) => {
            setExpanded(false);
            const newRoute = node.success
              ? networkRoute(urlBuilder.nodeDetails(hash))
              : notFoundRoute;
            setRoute(newRoute);
          });
          break;

        case isToken:
          if (isMainnet) {
            setRoute(notFoundRoute);
          } else {
            getToken(hash).then((token) => {
              setExpanded(false);
              const newRoute = token.success
                ? networkRoute(urlBuilder.tokenDetails(hash))
                : notFoundRoute;
              setRoute(newRoute);
            });
          }
          break;

        case isValidHash:
          Promise.all([getBlock(hash), getTransaction(hash), getMiniBlock(hash)]).then(
            ([block, transaction, miniblock]) => {
              setExpanded(false);
              switch (true) {
                case block.success:
                  setRoute(networkRoute(`/blocks/${hash}`));
                  break;
                case transaction.success:
                  setRoute(networkRoute(`/transactions/${hash}`));
                  break;
                case miniblock.success:
                  setRoute(networkRoute(`/miniblocks/${hash}`));
                  break;
                default:
                  setRoute(notFoundRoute);
                  break;
              }
            }
          );
          break;

        default:
          setExpanded(false);
          setRoute(notFoundRoute);
          break;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHash(e.target.value);
  };

  const reset = () => {
    if (route) {
      setRoute('');
    }
    if (hash) {
      setHash('');
    }
    if (searching) {
      setSearching(false);
    }
  };

  React.useEffect(reset, [route, pathname]);

  return route ? (
    <Redirect to={route} />
  ) : (
    <form className="main-search w-100 d-flex" noValidate={true}>
      <div className="input-group input-group-seamless">
        <input
          type="text"
          className="form-control border-0 rounded-pill py-3 pl-3 pl-lg-4 text-truncate"
          placeholder={`Search for an address, transaction/block hash ${
            isMainnet ? 'or validator key' : ',validator key or token id'
          }`} // TODO remove condition when Tokens go live
          name="requestType"
          data-testid="search"
          required
          value={hash}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className="input-group-append">
          <button
            type="submit"
            className="input-group-text outline-0 m-0 p-0"
            onClick={(e) => {
              e.preventDefault();
              onClick();
            }}
            data-testid="searchButton"
          >
            <div className="my-1 py-1 px-3 px-lg-4 border-left">
              {searching ? (
                <FontAwesomeIcon icon={faCircleNotch} spin className="mr-1 text-primary" />
              ) : (
                <FontAwesomeIcon icon={faSearch} className="mr-1 text-" />
              )}
            </div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
