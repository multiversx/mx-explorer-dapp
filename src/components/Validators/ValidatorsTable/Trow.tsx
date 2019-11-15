import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { TestnetLink, ShardSpan } from './../../../sharedComponents';
import { ValidatorType } from './../index';
import { truncate } from './../../../helpers';

const EmptySearch = ({
  validator,
  validatorDetails,
}: {
  validator: ValidatorType;
  validatorDetails: boolean;
}) => {
  return (
    <tr className="animated fadeIn">
      <td>
        {!validator.isValidator && (
          <>
            <FontAwesomeIcon icon={faEye} className="w300" />
            &nbsp;
          </>
        )}
        {validatorDetails ? (
          <TestnetLink to={`/validators/${validator.hexPublicKey}`}>
            {truncate(validator.hexPublicKey, 20)}
          </TestnetLink>
        ) : (
          <span ng-show="validatorInfosEnabled == false">
            {truncate(validator.hexPublicKey, 20)}
          </span>
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
        <TestnetLink to={`/blocks/shards/${validator.shardNumber}`}>
          <ShardSpan shardId={validator.shardNumber} />
          {validator.star && <span>*</span>}
        </TestnetLink>
      </td>
      <td>
        {validator.versionNumber ? (
          truncate(validator.versionNumber, 20)
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
          validator.isActive === false && <span ng-show="">0%</span>}
      </td>
      <td>
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
    </tr>
  );
};

export default EmptySearch;
