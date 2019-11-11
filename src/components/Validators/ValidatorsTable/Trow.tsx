import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ValidatorType } from './../ValidatorsPage';
import { truncate } from './../../../helpers';

const EmptySearch = ({
  validator,
  validatorInfosEnabled,
}: {
  validator: ValidatorType;
  validatorInfosEnabled: boolean;
}) => {
  return (
    <tr className="animated fadeIn">
      <td>
        {!validator.isValidator && <FontAwesomeIcon icon={faEye} className="w300" />}
        {validatorInfosEnabled ? (
          <a href="#/validator/{{validator.hexPublicKey}}" ng-show="validatorInfosEnabled">
            {truncate(validator.hexPublicKey, 20)}
          </a>
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
        {validator.shardId !== 'Metachain' ? (
          <a href="/#/shard/{{ validator.shardID }}/page/1">
            Shard {validator.shardId}
            <span ng-show="validator.star === true">*</span>
          </a>
        ) : (
          <a href="/#/shard/{{ validator.shardNumber }}/page/1">
            Metachain
            {validator.star && <span>*</span>}
          </a>
        )}
      </td>
      <td>{truncate(validator.versionNumber, 20)}</td>
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
