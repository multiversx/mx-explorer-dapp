import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { networkRoute } from 'helpers';
import { Redirect } from 'react-router-dom';
import { adapter } from 'sharedComponents';

const Search = () => {
  const { activeNetworkId } = useGlobalState();

  const { isAddress, isBlock, isTransaction, isNode } = adapter();
  const [route, setRoute] = React.useState('');

  const [hash, setHash] = React.useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  const onClick = async () => {
    const { success: hashIsNode } = await isNode({ hash });
    if (hashIsNode) {
      setRoute(networkRoute({ to: `/nodes/${hash}`, activeNetworkId }));
    } else if (await isBlock({ hash })) {
      setRoute(networkRoute({ to: `/blocks/${hash}`, activeNetworkId }));
    } else if (await isTransaction({ hash })) {
      setRoute(networkRoute({ to: `/transactions/${hash}`, activeNetworkId }));
    } else if (await isAddress({ hash })) {
      setRoute(networkRoute({ to: `/address/${hash}`, activeNetworkId }));
    } else {
      setRoute(networkRoute({ to: `/search/${hash}`, activeNetworkId }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHash(e.target.value);
  };

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
