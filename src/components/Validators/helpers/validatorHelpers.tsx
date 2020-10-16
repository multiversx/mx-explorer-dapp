import { ValidatorType } from 'context/validators';
import { validatorIssues } from './../RowIcon';
import getPeerType from './getPeerType';
import computeShardStatus from './computeShardStatus';
import { getShardId } from 'sharedComponents/Adapter/functions/getValidators';

interface ShardDataType {
  [key: string]: {
    allValidators: number;
    allActiveValidators: number;
    shardNumber: number;
  };
}
export interface ValidatorStatisticsData {
  rating: number;
  ratingModifier: number;
  shardId: number;
  validatorStatus: ValidatorType['peerType'];
}
export interface StatisticsType {
  [hash: string]: ValidatorStatisticsData;
}

export const buildValidator = ({
  publicKey,
  statisticsValidator,
  validatorData,
  metaChainShardId,
  configVersionNumber,
  nrOfShards,
}: {
  publicKey: string;
  statisticsValidator: ValidatorStatisticsData;
  validatorData: ValidatorDataType;
  metaChainShardId: number;
  nrOfShards: number;
  configVersionNumber: string;
}) => {
  const {
    shardId: statisticsShardId,
    validatorStatus: peerType,
    rating,
    ratingModifier,
  } = statisticsValidator;
  const pKeyinValidatorData = publicKey in validatorData;

  const computedShardID = pKeyinValidatorData
    ? validatorData[publicKey].computedShardID
    : statisticsShardId;
  const receivedShardID = pKeyinValidatorData
    ? validatorData[publicKey].receivedShardID
    : statisticsShardId;

  const isActive = pKeyinValidatorData ? validatorData[publicKey].isActive : false;
  const nodeDisplayName = pKeyinValidatorData
    ? validatorData[publicKey].nodeDisplayName
    : publicKey;
  const identity = pKeyinValidatorData ? validatorData[publicKey].identity : '';
  const timeStamp = pKeyinValidatorData ? validatorData[publicKey].timeStamp : '';
  const totalDownTimeSec = pKeyinValidatorData ? validatorData[publicKey].totalDownTimeSec : 0;
  const totalUpTimeSec = pKeyinValidatorData ? validatorData[publicKey].totalUpTimeSec : 0;
  const versionNumber = pKeyinValidatorData ? validatorData[publicKey].versionNumber : '';
  const shardId =
    statisticsShardId === metaChainShardId ? 'Metachain' : String(statisticsShardId).toString();

  const validator: ValidatorType = {
    publicKey,
    isValidator: peerType !== 'observer',
    computedShardID,
    receivedShardID,
    isActive,
    peerType,
    status: 'online',
    nodeDisplayName,
    identity,
    nodeType: 'validator',
    timeStamp,
    totalDownTimeSec,
    totalUpTimeSec,
    versionNumber,
    shardId,
    shardNumber: statisticsShardId,
    rating,
    ratingModifier,
    issue: '',
  };

  if (validator.isValidator) {
    validator.issue = validatorIssues({
      validator,
      versionNumber: configVersionNumber,
      nrOfShards,
      metaChainShardId,
    });
  }

  return validator;
};

export interface ValidatorDataType {
  [key: string]: ValidatorType;
}
export function populateValidatorsTable({
  data,
  metaChainShardId,
  statistics,
  versionNumber,
  nrOfShards,
}: {
  data: ValidatorType[];
  metaChainShardId: number;
  nrOfShards: number;
  statistics: StatisticsType;
  versionNumber: string;
}) {
  const shardData: ShardDataType = {};
  const allShardIDs: string[] = [];
  const validators: ValidatorType[] = [];
  const validatorsAndObservers: ValidatorType[] = [];
  const heartbeatObservers = data.filter((v) => !Object.keys(statistics).includes(v.publicKey));

  const statisticsData = statistics
    ? Object.keys(statistics).map((publicKey) => {
        return {
          publicKey,
          ...statistics[publicKey],
        };
      })
    : [];
  const validatorData: ValidatorDataType = {};
  data.map((validator) => {
    validatorData[validator.publicKey] = { ...validator };
    return null;
  });

  statisticsData.forEach((statisticsValidator) => {
    const validator = buildValidator({
      publicKey: statisticsValidator.publicKey,
      metaChainShardId,
      validatorData,
      statisticsValidator,
      configVersionNumber: versionNumber,
      nrOfShards,
    });

    const shardId = validator.shardId;

    if (['eligible', 'waiting', 'jailed', 'new'].includes(validator.peerType)) {
      validators.push(validator);
    }
    validatorsAndObservers.push(validator);

    allShardIDs.push(shardId.toString()); // TODO: check shardID

    const activeValidator = validator.peerType === 'eligible' || validator.peerType === 'waiting';

    if (validator.shardId && validator.shardId in shardData) {
      if (activeValidator) {
        shardData[shardId].allValidators = shardData[shardId].allValidators + 1;
        shardData[shardId].allActiveValidators = validator.isActive
          ? shardData[shardId].allActiveValidators + 1
          : shardData[shardId].allActiveValidators;
      }
    } else if (validator.shardId) {
      shardData[shardId] = {
        allValidators: 0,
        allActiveValidators: 0,
        shardNumber: validator.shardNumber,
      };
      shardData[shardId].allValidators = activeValidator ? 1 : 0;
      shardData[shardId].allActiveValidators = activeValidator && validator.isActive ? 1 : 0;
    }
  });
  if (heartbeatObservers.length > 0) {
    heartbeatObservers.forEach((validator: ValidatorType, i) => {
      const { shardId, shardNumber } = getShardId(validator, metaChainShardId);

      const statisticsHasValidatorHash =
        statistics !== undefined &&
        statistics !== null &&
        typeof statistics === 'object' &&
        Object.keys(statistics).length &&
        validator.publicKey in statistics;

      const { rating } = statisticsHasValidatorHash
        ? statistics[validator.publicKey]
        : {
            rating: 0,
          };

      const { ratingModifier } = statisticsHasValidatorHash
        ? statistics[validator.publicKey]
        : {
            ratingModifier: 0,
          };

      validator = {
        ...validator,
        shardId,
        shardNumber,
        peerType: validator.peerType
          ? getPeerType(validator.peerType)
          : getPeerType(validator.isValidator ? 'eligible' : 'observer'),
        rating,
        ratingModifier,
        issue: '',
      };
      if (validator.isValidator) {
        validator.issue = validatorIssues({
          validator,
          versionNumber,
          nrOfShards,
          metaChainShardId,
        });
      }

      if (['eligible', 'waiting', 'jailed', 'new'].includes(validator.peerType)) {
        validators.push(validator);
      }
      validatorsAndObservers.push(validator);

      allShardIDs.push(shardId.toString()); // TODO: check shardID

      const activeValidator = validator.peerType === 'eligible' || validator.peerType === 'waiting';

      if (validator.shardId && validator.shardId in shardData) {
        if (activeValidator) {
          shardData[shardId].allValidators = shardData[shardId].allValidators + 1;
          shardData[shardId].allActiveValidators = validator.isActive
            ? shardData[shardId].allActiveValidators + 1
            : shardData[shardId].allActiveValidators;
        }
      } else if (validator.shardId) {
        shardData[shardId] = {
          allValidators: 0,
          allActiveValidators: 0,
          shardNumber: validator.shardNumber,
        };
        shardData[shardId].allValidators = activeValidator ? 1 : 0;
        shardData[shardId].allActiveValidators = activeValidator && validator.isActive ? 1 : 0;
      }
    });
  }

  const shardDataArray = Object.keys(shardData).map((shardID: any) =>
    Object.assign(
      {
        shardID,
        status: computeShardStatus(
          shardData[shardID].allActiveValidators,
          shardData[shardID].allValidators
        ),
      },
      shardData[shardID]
    )
  );
  // this gets all distinct shards
  const shardsList = [...Array.from(new Set(allShardIDs))];

  return {
    shardData: shardDataArray,
    shardsList,
    validators,
    validatorsAndObservers,
  };
}

export type DirectioinsType = 'none' | 'desc' | 'asc';

export interface HeadersType {
  id: string;
  label: string;
  dir: DirectioinsType;
}

interface ToggleSortType {
  oldDir: DirectioinsType;
  oldSortColumn: string;
  currentSortColumn: string;
}

export function getNewSortData({ oldDir, oldSortColumn, currentSortColumn }: ToggleSortType) {
  const directions: DirectioinsType[] = ['asc', 'desc', 'none'];

  let dirIndex = directions.indexOf(oldDir); // check the position of 'none' in the directions array
  dirIndex = dirIndex === directions.length - 1 ? 0 : dirIndex + 1; // go to next position
  const newDir = directions[dirIndex]; // assign next position to current column

  const sameColumnClicked = oldSortColumn === currentSortColumn;
  const noDirection = newDir === 'none';

  // reset the sort ar 3rd click or set current column
  const newSortColumn = sameColumnClicked && noDirection ? '' : currentSortColumn;

  return {
    field: newSortColumn,
    dir: newDir,
  };
}
