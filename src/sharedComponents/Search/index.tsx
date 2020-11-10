import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetworkRoute } from 'helpers';
import { Redirect, useLocation } from 'react-router-dom';
import { adapter } from 'sharedComponents';

const Search = () => {
  const { pathname } = useLocation();
  const networkRoute = useNetworkRoute();
  const { isAddress, isBlock, isTransaction, getNode, getMiniBlock } = adapter();
  const [route, setRoute] = React.useState('');

  const [hash, setHash] = React.useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  const onClick = async () => {
    if ((await getNode(hash)).success) {
      setRoute(networkRoute(`/nodes/${hash}`));
    } else if (await isBlock({ hash })) {
      setRoute(networkRoute(`/blocks/${hash}`));
    } else if (await isTransaction({ hash })) {
      setRoute(networkRoute(`/transactions/${hash}`));
    } else if (await isAddress({ hash })) {
      setRoute(networkRoute(`/address/${hash}`));
    } else if ((await getMiniBlock(hash)).blockFetched) {
      setRoute(networkRoute(`/miniblocks/${hash}`));
    } else {
      setRoute(networkRoute(`/search/${hash}`));
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
  };

  React.useEffect(reset, [route, pathname]);

  return route ? (
    <Redirect to={route} />
  ) : (
    <>
      <input
        type="text"
        className="form-control ml-3 pr-3"
        placeholder="Address / Txn Hash / Block Hash"
        name="requestType"
        data-testid="search"
        required
        value={hash}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="input-group-prepend">
        <button
          type="submit"
          className="input-group-text"
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          data-testid="searchButton"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </>
  );
};

export default Search;
