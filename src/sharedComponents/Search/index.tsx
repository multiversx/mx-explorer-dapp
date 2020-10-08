import { faSearch } from '@fortawesome/pro-solid-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { networkRoute } from 'helpers';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { adapter } from 'sharedComponents';

const Search = () => {
  const { activeNetworkId, brandData, validatorData } = useGlobalState();

  const { isAddress, isBlock, isTransaction } = adapter();

  const history = useHistory();
  const [hash, setHash] = React.useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClick();
    }
  };

  const onClick = async () => {
    const isValidator =
      hash &&
      validatorData.validators.length &&
      validatorData.validators.some((validator) => validator.publicKey === hash);
    const brand =
      hash &&
      validatorData.validators.length &&
      brandData.some(
        (brand) =>
          brand.identity === hash || brand.name.toLowerCase().includes(hash.trim().toLowerCase())
      )
        ? brandData.find(
            (brand) =>
              brand.identity === hash ||
              brand.name.toLowerCase().includes(hash.trim().toLowerCase())
          )!.identity
        : '';

    if (isValidator) {
      history.push(networkRoute({ to: `/validators/nodes/${hash}`, activeNetworkId }));
    } else if (brand) {
      history.push(networkRoute({ to: `/validators/${brand}`, activeNetworkId }));
    } else if (await isBlock({ hash })) {
      history.push(networkRoute({ to: `/blocks/${hash}`, activeNetworkId }));
    } else if (await isTransaction({ hash })) {
      history.push(networkRoute({ to: `/transactions/${hash}`, activeNetworkId }));
    } else if (await isAddress({ hash })) {
      history.push(networkRoute({ to: `/address/${hash}`, activeNetworkId }));
    } else {
      history.push(networkRoute({ to: `/search/${hash}`, activeNetworkId }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHash(e.target.value);
  };

  return (
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
          onClick={onClick}
          data-testid="searchButton"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </>
  );
};

export default Search;
