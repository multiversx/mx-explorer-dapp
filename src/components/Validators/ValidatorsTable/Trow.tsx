import { faClock, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { truncate } from './../../../helpers';
import { ShardSpan, TestnetLink } from './../../../sharedComponents';
import { ValidatorType } from './../index';

const ValidatorRow = ({
  validator,
  validatorDetails,
  validatorStatistics,
  rowIndex,
  ratingOrder
}: {
  validator: ValidatorType;
  rowIndex: number;
  validatorDetails: boolean;
  validatorStatistics: boolean;
  ratingOrder: string[];
}) => {
  return (
    <tr className="animated fadeIn">
      {validatorStatistics ? (
        <td>{validator.rating > 0 ? ratingOrder.indexOf(validator.publicKey) + 1 : null}</td>
      ) : (
        <></>
      )}
      <td>
        {validator.peerType === 'observer' && (
          <FontAwesomeIcon title="observer" icon={faEye} className="w300 mr-1" />
        )}
        {validator.peerType === 'waiting' && (
          <FontAwesomeIcon icon={faClock} className="w300 mr-1" />
        )}
        {validator.peerType !== 'observer' && validatorDetails ? (
          <TestnetLink
            to={`/validators/${validator.publicKey}`}
            data-testid={`publicKeyLink${rowIndex}`}
          >
            {truncate(validator.publicKey, 20)}
          </TestnetLink>
        ) : (
          <span>{truncate(validator.publicKey, 20)}</span>
        )}
      </td>
      <td>
        {validator.nodeDisplayName ? (
          truncate(validator.nodeDisplayName, 20)
        ) : (
          <span className="text-muted">N/A</span>
        )}
      </td>
      <td>
        <TestnetLink
          to={`/blocks/shards/${validator.shardNumber}`}
          data-testid={`shardLink${rowIndex}`}
        >
          <ShardSpan shardId={validator.shardNumber} />
          {validator.star && <span>*</span>}
        </TestnetLink>
      </td>
      <td>
        {validator.versionNumber ? (
          truncate(validator.versionNumber.split('-')[0], 20)
        ) : (
          <span className="text-muted">N/A</span>
        )}
      </td>
      
      <td className="text-right">
        {(validator.totalUpTimeSec !== 0 || validator.totalDownTimeSec !== 0) && (
          <span>
            {Math.floor(
              (validator.totalUpTimeSec * 100) /
                (validator.totalUpTimeSec + validator.totalDownTimeSec)
            )}
            %
          </span>
        )}
        {validator.totalUpTimeSec === 0 &&
          validator.totalDownTimeSec === 0 &&
          validator.isActive === true && <span>100%</span>}
        {validator.totalUpTimeSec === 0 &&
          validator.totalDownTimeSec === 0 &&
          validator.isActive === false && <span>0%</span>}
      </td>

      <td className="text-right">
        {validator.isActive === true ? (
          <div>
            <span className="badge badge-pill badge-success badge-status">&nbsp;</span>
            &nbsp;
            <span>Online</span>
          </div>
        ) : (
          <div>
            <span className="badge badge-pill badge-danger badge-status">&nbsp;</span>
            &nbsp;
            <span className={validator.isValidator === false ? 'text-muted' : ''}>Offline</span>
          </div>
        )}
      </td>
    
      {validatorStatistics ? (
        <td className="text-right">{validator.rating > 0 ? Math.floor(validator.rating) : null}</td>
      ) : (
        <></>
      )}
    </tr>
  );
};

export default ValidatorRow;
