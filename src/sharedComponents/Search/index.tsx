import React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { isAddress, isBlock, isTransaction } from './helpers/asyncRequests';

const Search: React.FC = () => {
  const {
    activeTestnet: { elasticUrl, nodeUrl },
    activeTestnetId,
    timeout,
  } = useGlobalState();
  let history = useHistory();
  const [hash, setHash] = React.useState<string>('');

  const testnetRoute = (to: string) => (activeTestnetId ? `/${activeTestnetId}${to}` : to);
  const handleKeyDown = function(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      onClick();
    }
  };
  const onClick = async () => {
    if (await isBlock({ elasticUrl, hash, timeout })) {
      history.push(testnetRoute(`/blocks/${hash}`));
    } else if (await isTransaction({ elasticUrl, hash, timeout })) {
      history.push(testnetRoute(`/transactions/${hash}`));
    } else if (await isAddress({ nodeUrl, hash, timeout })) {
      history.push(testnetRoute(`/address/${hash}`));
    } else {
      history.push(testnetRoute(`/search/${hash}`));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setHash(e.target.value);

  return (
    <>
      <input
        type="text"
        className="form-control"
        placeholder="Search by Address / Txn Hash / Block Hash"
        name="requestType"
        required
        value={hash}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="input-group-append">
        <button type="submit" className="input-group-text" onClick={onClick}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </>
  );
};

export default Search;
