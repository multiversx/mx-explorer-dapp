import * as React from 'react';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol.svg';

export const EgldRow = () => {
  const {
    economics,
    stats,
    activeNetwork: { erdLabel },
  } = useGlobalState();
  const description = `The Elrond eGold (${erdLabel}) Token is native to the Elrond Network and will be used for everything from staking, governance, transactions, smart contracts and validator rewards.`;

  return (
    <tr className="egld-row">
      <td>
        <div className="token-identity d-flex flex-row">
          <div className="d-flex align-items-center mr-3">
            <span className="token-link">
              <div className="egld-icon token-icon d-flex align-items-center justify-content-center">
                <ElrondSymbol />
              </div>
            </span>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <span className="d-block token-ticker">{erdLabel}</span>
            <div
              className="token-description text-wrap text-secondary small d-none d-md-block"
              title={description}
            >
              {description}
            </div>
          </div>
        </div>
      </td>
      <td>Elrond {erdLabel}</td>
      <td>{stats.accounts}</td>
      <td>{stats.transactions}</td>
      <td>{economics.price}</td>
      <td>{economics.circulatingSupply}</td>
      <td>{economics.marketCap}</td>
    </tr>
  );
};

export default EgldRow;
