import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faCircleNotch } from '@fortawesome/pro-regular-svg-icons/faCircleNotch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetworkRoute, urlBuilder, isHash, isContract, addressIsBech32, bech32 } from 'helpers';
import { Redirect, useLocation } from 'react-router-dom';
import { adapter } from 'sharedComponents';

interface SearchType {
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = ({ setExpanded = () => null }: SearchType) => {
  const { pathname } = useLocation();
  const networkRoute = useNetworkRoute();
  const {
    getAccount,
    getBlock,
    getTransaction,
    getNode,
    getMiniBlock,
    getToken,
    getNft,
    getScResult,
    getCollection,
  } = adapter();
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

      let isPubKeyAccount = false;
      try {
        isPubKeyAccount = hash.length < 65 && addressIsBech32(bech32.encode(hash));
      } catch {}

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
          Promise.all([getToken(hash), getNft(hash), getCollection(hash)]).then(
            ([token, nft, collection]) => {
              setExpanded(false);
              switch (true) {
                case token.success:
                  setRoute(networkRoute(urlBuilder.tokenDetails(hash)));
                  break;
                case nft.success:
                  setRoute(networkRoute(urlBuilder.nftDetails(hash)));
                  break;
                case collection.success:
                  setRoute(networkRoute(urlBuilder.collectionDetails(hash)));
                  break;
                default:
                  setRoute(notFoundRoute);
                  break;
              }
            }
          );

          break;

        case isValidHash:
          Promise.all([
            getBlock(hash),
            getScResult(hash),
            getTransaction(hash),
            getMiniBlock(hash),
          ]).then(([block, scResult, transaction, miniblock]) => {
            setExpanded(false);
            switch (true) {
              case block.success:
                setRoute(networkRoute(`/blocks/${hash}`));
                break;
              case scResult.success:
                setRoute(networkRoute(`/transactions/${scResult.data.originalTxHash}#${hash}`));
                break;
              case transaction.success:
                setRoute(networkRoute(`/transactions/${hash}`));
                break;
              case miniblock.success:
                setRoute(networkRoute(`/miniblocks/${hash}`));
                break;
              default:
                if (isPubKeyAccount) {
                  getAccount(bech32.encode(hash)).then((account) => {
                    if (account.success) {
                      if (isContract(hash) || account.data.nonce > 0) {
                        const newRoute = networkRoute(
                          urlBuilder.accountDetails(bech32.encode(hash))
                        );
                        setRoute(newRoute);
                      }
                    }
                  });
                }
                setRoute(notFoundRoute);
                break;
            }
          });

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(reset, [route, pathname]);

  return route ? (
    <Redirect to={route} />
  ) : (
    <form className="main-search w-100 d-flex" noValidate={true}>
      <div className="input-group input-group-seamless">
        <input
          type="text"
          className="form-control border-0 rounded-pill py-3 pl-3 pl-lg-4 text-truncate"
          placeholder="Search for an address, transaction/block hash ,validator key or token id"
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
