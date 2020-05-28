import { validatorFunctions } from 'helpers';
import { ShardDataType, ValidatorType } from './../index';

export interface ValidatorStatisticsData {
  rating: number;
  ratingModifier: number;
  shardId: number;
  validatorStatus: ValidatorType['peerType'];
}

export interface StatisticsType {
  [hash: string]: ValidatorStatisticsData;
}

export const getPeerType = (peerType: ValidatorType['peerType']) => {
  switch (true) {
    case peerType.includes('observer'):
      return 'observer';
    case peerType.includes('waiting'):
      return 'waiting';
    default:
      return 'eligible';
  }
};

interface ComputeValidatorType {
  validator: ValidatorType;
  statistics: StatisticsType;
  metaChainShardId: number;
}

export function computeValidator({
  validator,
  statistics,
  metaChainShardId,
}: ComputeValidatorType) {
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

  const statisticsShardId = statisticsHasValidatorHash
    ? statistics[validator.publicKey].shardId
    : undefined;

  const { shardId, shardNumber, star } = validatorFunctions.getShardId(
    validator,
    metaChainShardId,
    statisticsShardId
  );

  const { ratingModifier } = statisticsHasValidatorHash
    ? statistics[validator.publicKey]
    : {
        ratingModifier: 0,
      };

  let peerType: ValidatorType['peerType'] = getPeerType(validator.peerType);

  peerType =
    statisticsHasValidatorHash && statistics[validator.publicKey].validatorStatus
      ? statistics[validator.publicKey].validatorStatus
      : peerType;

  const isActive = statisticsHasValidatorHash ? false : validator.isActive;

  const totalUpTimeSec = statisticsHasValidatorHash ? 0 : validator.totalUpTimeSec;
  const totalDownTimeSec = statisticsHasValidatorHash ? 0 : validator.totalDownTimeSec;
  const versionNumber = statisticsHasValidatorHash ? '' : validator.versionNumber;
  const nodeDisplayName = !statisticsHasValidatorHash
    ? validator.publicKey
    : validator.nodeDisplayName;

  validator = {
    ...validator,
    totalUpTimeSec,
    totalDownTimeSec,
    isActive,
    versionNumber,
    shardId,
    nodeDisplayName,
    shardNumber,
    star,
    peerType,
    rating,
    ratingModifier,
  };
  return { validator, shardId };
}

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

  if (statistics !== undefined) {
    const statisticsData = Object.keys(statistics).map(publicKey => {
      return {
        publicKey,
        ...statistics[publicKey],
      };
    });
    const validatorData: { [key: string]: ValidatorType } = {};
    data.map(validator => {
      validatorData[validator.publicKey] = { ...validator };
      return null;
    });
    statisticsData.forEach(
      ({
        publicKey,
        shardId: statisticsShardId,
        validatorStatus: peerType,
        rating,
        ratingModifier,
      }) => {
        const pKeyinValidatorData = publicKey in validatorData;

        //TODO: e corect?
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
        const totalDownTimeSec = pKeyinValidatorData
          ? validatorData[publicKey].totalDownTimeSec
          : 0;
        const totalUpTimeSec = pKeyinValidatorData ? validatorData[publicKey].totalUpTimeSec : 0;
        const versionNumber = pKeyinValidatorData ? validatorData[publicKey].versionNumber : '';
        const shardId =
          statisticsShardId === metaChainShardId ? 'Metachain' : statisticsShardId.toString();

        const star = isActive === true && computedShardID !== receivedShardID;

        const validator: ValidatorType = {
          publicKey,
          isValidator: peerType !== 'observer',
          computedShardID,
          receivedShardID,
          isActive,
          peerType,
          nodeDisplayName,
          identity,
          timeStamp,
          totalDownTimeSec,
          totalUpTimeSec,
          versionNumber,
          shardId,
          shardNumber: statisticsShardId,
          star,
          rating,
          ratingModifier,
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
      }
    );
  } else {
    data.forEach((validatorEntry: ValidatorType, i) => {
      const { validator, shardId } = computeValidator({
        validator: validatorEntry,
        statistics,
        metaChainShardId,
      });

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
