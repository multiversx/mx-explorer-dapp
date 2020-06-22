import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { testnetRoute } from 'helpers';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { isAddress, isBlock, isTransaction } from './helpers/asyncRequests';
import useSetValidatorsData from 'components/Validators/useSetValidatorsData';

const FetchValidatorsComponent = () => {
  const ref = React.useRef(null);
  useSetValidatorsData(ref);
  return <i ref={ref} />;
};

const Search = () => {
  const {
    activeTestnet: { elasticUrl, nodeUrl },
    activeTestnetId,
    timeout,
    brandData,
    validatorData,
  } = useGlobalState();
  const { pathname } = useLocation();

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
      history.push(testnetRoute({ to: `/validators/nodes/${hash}`, activeTestnetId }));
    } else if (brand) {
      history.push(testnetRoute({ to: `/validators/${brand}`, activeTestnetId }));
    } else if (await isBlock({ elasticUrl, hash, timeout })) {
      history.push(testnetRoute({ to: `/blocks/${hash}`, activeTestnetId }));
    } else if (await isTransaction({ elasticUrl, hash, timeout })) {
      history.push(testnetRoute({ to: `/transactions/${hash}`, activeTestnetId }));
    } else if (await isAddress({ nodeUrl, hash, timeout })) {
      history.push(testnetRoute({ to: `/address/${hash}`, activeTestnetId }));
    } else {
      history.push(testnetRoute({ to: `/search/${hash}`, activeTestnetId }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setHash(e.target.value);

  return (
    <>
      {!pathname.includes('validators') && brandData.length === 0 && <FetchValidatorsComponent />}
      <input
        type="text"
        className="form-control mr-sm-2 pl-3"
        placeholder="Address / Txn Hash / Block Hash"
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
          className="input-group-text"
          onClick={onClick}
          data-testid="searchButton"
          disabled={validatorData.validators.length === 0}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </>
  );
};

export default Search;
