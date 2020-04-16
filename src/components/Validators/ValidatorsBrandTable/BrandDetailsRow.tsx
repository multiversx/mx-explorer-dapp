import * as React from 'react';
import { truncate } from '../../../helpers';
import { ShardSpan, TestnetLink } from '../../../sharedComponents';
import { ValidatorType } from '../index';

interface BrandDetailsRowType {
    validator: ValidatorType;
    rowIndex: number;
}

const BrandDetailsRow = ({
  validator,
  rowIndex
}: BrandDetailsRowType) => {
  return (
    <tr>
        <td>
            <TestnetLink
                to={`/validators/${validator.publicKey}`}
                data-testid={`hexPublicKeyLink${rowIndex}`}
            >
                {truncate(validator.publicKey, 20)}
            </TestnetLink>
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
        
        <td className="text-right">{validator.rating > 0 ? Math.floor(validator.rating) : null}</td>
    </tr>
  );
};

export default BrandDetailsRow;
