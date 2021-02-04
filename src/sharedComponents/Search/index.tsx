import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faCircleNotch } from '@fortawesome/pro-regular-svg-icons/faCircleNotch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetworkRoute, urlBuilder } from 'helpers';
import { Redirect, useLocation } from 'react-router-dom';
import { adapter } from 'sharedComponents';

interface SearchType {
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = ({ setExpanded = () => null }: SearchType) => {
  const { pathname } = useLocation();
  const networkRoute = useNetworkRoute();
  const { getAccount, getBlock, getTransaction, getNode, getMiniBlock, getUser } = adapter();
  const [route, setRoute] = React.useState('');
  const [searching, setSearching] = React.useState(false);

  const [hash, setHash] = React.useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  const notFound = () => {
    setRoute(networkRoute(`/search/${hash}`));
  };

  const onClick = async () => {
    if (Boolean(hash)) {
      setSearching(true);

      const isAccount = hash.startsWith('erd1');
      const isValidHash = hash.match(/([a-z0-9])/) !== null && hash.length === 64;
      const isValidatorKey = hash.match(/([a-z0-9])/) !== null && hash.length === 192;

      if (isAccount) {
        getAccount(hash).then((account) => {
          setExpanded(false);
          if (account.success) {
            setRoute(networkRoute(urlBuilder.accountDetails(hash)));
          } else {
            notFound();
          }
        });
      }

      if (isValidatorKey) {
        getNode(hash).then((node) => {
          setExpanded(false);
          if (node.success) {
            setRoute(networkRoute(urlBuilder.nodeDetails(hash)));
          } else {
            notFound();
          }
        });
      }

      if (isValidHash) {
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
                notFound();
                break;
            }
          }
        );
      }

      if (!isAccount && !isValidatorKey && !isValidHash) {
        Promise.all([getUser(hash)]).then(([userData]) => {
          setExpanded(false);
          switch (true) {
            case userData.success:
              setRoute(networkRoute(urlBuilder.accountDetails(userData.data.address)));
              break;
            default:
              notFound();
              break;
          }
        });
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
    <form className="w-100 d-flex mx-md-2">
      <div className="input-group input-group-seamless py-md-2">
        <input
          type="text"
          className="form-control rounded-pill my-1 text-truncate"
          placeholder="Address / Tx Hash / Block Hash / Validator Key / Herotag"
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
            className="input-group-text side-action outline-0 m-0"
            onClick={(e) => {
              e.preventDefault();
              onClick();
            }}
            data-testid="searchButton"
          >
            {searching ? (
              <FontAwesomeIcon icon={faCircleNotch} spin className="mr-1 text-primary" />
            ) : (
              <FontAwesomeIcon icon={faSearch} className="mr-1" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
