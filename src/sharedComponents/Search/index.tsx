import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faCircleNotch } from '@fortawesome/pro-regular-svg-icons/faCircleNotch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetworkRoute } from 'helpers';
import { Redirect, useLocation } from 'react-router-dom';
import { adapter } from 'sharedComponents';

const Search = () => {
  const { pathname } = useLocation();
  const networkRoute = useNetworkRoute();
  const { isAddress, isBlock, isTransaction, getNode, getMiniBlock } = adapter();
  const [route, setRoute] = React.useState('');
  const [searching, setSearching] = React.useState(false);

  const [hash, setHash] = React.useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  const onClick = async () => {
    if (Boolean(hash)) {
      setSearching(true);

      Promise.all([
        getNode(hash),
        isBlock(hash),
        isTransaction(hash),
        isAddress(hash),
        getMiniBlock(hash),
      ]).then(([node, block, transaction, address, miniblock]) => {
        switch (true) {
          case node.success:
            setRoute(networkRoute(`/nodes/${hash}`));
            break;
          case block:
            setRoute(networkRoute(`/blocks/${hash}`));
            break;
          case transaction:
            setRoute(networkRoute(`/transactions/${hash}`));
            break;
          case address:
            setRoute(networkRoute(`/address/${hash}`));
            break;
          case miniblock.blockFetched:
            setRoute(networkRoute(`/miniblocks/${hash}`));
            break;
          default:
            setRoute(networkRoute(`/search/${hash}`));
            break;
        }
      });
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
    <form className="w-100 d-flex">
      <div className="input-group input-group-seamless py-2">
        <input
          type="text"
          className="form-control rounded-pill mx-2 my-1"
          placeholder="Address / Tx Hash / Block Hash / Validator Key"
          name="requestType"
          data-testid="search"
          required
          value={hash}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className="input-group-append pr-2">
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
