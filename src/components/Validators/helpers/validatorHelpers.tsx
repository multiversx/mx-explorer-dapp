import { getShardId } from './../../../helpers';
import { ShardDataType, ValidatorType } from './../index';

export interface ValidatorStatisticsData {
  nrLeaderSuccess: number;
  nrLeaderFailure: number;
  nrValidatorSuccess: number;
  nrValidatorFailure: number;
}

export interface StatisticsType {
  [hash: string]: ValidatorStatisticsData;
}

export const getPeerType = (peerType: string) => {
  switch (true) {
    case peerType.includes('observer'):
      return 'observer';
    case peerType.includes('waiting'):
      return 'waiting';
    default:
      return 'eligible';
  }
};

export function populateValidatorsTable({
  data,
  metaChainShardId,
  statistics = {},
}: {
  data: ValidatorType[];
  metaChainShardId: number;
  statistics?: StatisticsType;
}) {
  const shardData: ShardDataType = {};
  const allShardIDs: string[] = [];
  const validators: ValidatorType[] = [];
  const validatorsAndObservers: ValidatorType[] = [];

  data.forEach((validator: ValidatorType, i) => {
    const { shardId, shardNumber, star } = getShardId(validator, metaChainShardId);

    const statisticsHasValidatorHash =
      typeof statistics === 'object' &&
      Object.keys(statistics).length &&
      validator.hexPublicKey in statistics;

    const {
      nrLeaderSuccess,
      nrLeaderFailure,
      nrValidatorSuccess,
      nrValidatorFailure,
    } = statisticsHasValidatorHash
      ? statistics[validator.hexPublicKey]
      : {
          nrLeaderSuccess: 0,
          nrLeaderFailure: 0,
          nrValidatorSuccess: 0,
          nrValidatorFailure: 0,
        };
    validator = {
      ...validator,
      shardId,
      shardNumber,
      star,
      peerType: validator.peerType
        ? getPeerType(validator.peerType)
        : getPeerType(validator.isValidator ? 'eligible' : 'observer'),
      // TODO: remove start
      ...(process.env.NODE_ENV === 'development' && !validator.peerType
        ? {
            peerType: (() => {
              const peerTypeValues = ['waiting', 'eligible'];
              const randomIndex = Math.floor(Math.random() * 2);
              const value = peerTypeValues[randomIndex] === 'waiting' ? 'waiting' : 'eligible';
              return validator.isValidator ? value : 'observer';
            })(),
          }
        : {}),
      // TODO: remove end
      leader:
        nrLeaderSuccess !== 0 || nrLeaderFailure !== 0
          ? Math.floor((nrLeaderSuccess * 100) / (nrLeaderSuccess + nrLeaderFailure))
          : 0,
      validator:
        nrValidatorSuccess !== 0 || nrValidatorFailure !== 0
          ? Math.floor((nrValidatorSuccess * 100) / (nrValidatorSuccess + nrValidatorFailure))
          : 0,
    };

    if (['eligible', 'waiting'].includes(validator.peerType)) {
      validators.push(validator);
    }
    validatorsAndObservers.push(validator);

    allShardIDs.push(shardId.toString()); // TODO: check shardID

    if (validator.shardId && validator.shardId in shardData) {
      if (validator.peerType === 'eligible') {
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
      shardData[shardId].allValidators = validator.peerType === 'eligible' ? 1 : 0;
      shardData[shardId].allActiveValidators =
        validator.peerType === 'eligible' && validator.isActive ? 1 : 0;
    }
  });

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
  ); // [{shardID, allValidators, allTrueValidators}]
  // this gets all distinct shards
  const shardsList = [...Array.from(new Set(allShardIDs))];

  return {
    shardData: shardDataArray,
    shardsList,
    validators,
    validatorsAndObservers,
  };
}

function computeShardStatus(allActiveValidators: number, allValidators: number) {
  const danger = Math.ceil(allValidators * (2 / 3)) + 1;
  const warning = Math.ceil(allValidators - (allValidators - danger) / 2);
  switch (true) {
    case allActiveValidators >= warning:
      return 'success';
    case danger <= allActiveValidators && allActiveValidators < warning:
      return 'warning';
    default:
      return 'danger';
  }
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
