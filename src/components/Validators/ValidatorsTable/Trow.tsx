import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { truncate } from './../../../helpers';
import { ShardSpan, TestnetLink } from './../../../sharedComponents';
import { ValidatorType } from './../index';

const EmptySearch = ({
  validator,
  validatorDetails,
  validatorStatistics,
}: {
  validator: ValidatorType;
  validatorDetails: boolean;
  validatorStatistics: boolean;
}) => {
  const validatorStatisticsCells = validatorStatistics ? (
    <>
      <td className="text-right">
        {validator.leader !== 0 ? (
          <span>{validator.leader}%</span>
        ) : (
          <span className="text-muted">N/A</span>
        )}
      </td>
      {/* <td className="text-right">
        {validator.validator !== 0 ? (
          <span>{validator.validator}%</span>
        ) : (
          <span className="text-muted">N/A</span>
        )}
      </td> */}
    </>
  ) : (
    <></>
  );
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
          <span>{truncate(validator.hexPublicKey, 20)}</span>
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
      {validatorStatisticsCells}
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
