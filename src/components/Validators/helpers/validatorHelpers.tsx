import { ValidatorType, ShardDataType } from './../index';
import { getShardId } from './../../../helpers';

export function populateValidatorsTable(data: ValidatorType[], metaChainShardId: number) {
  const shardData: ShardDataType = {};
  const allShardIDs: string[] = [];
  const validators: ValidatorType[] = [];
  const validatorsAndObservers: ValidatorType[] = [];

  data.forEach((validator: ValidatorType, i) => {
    const { shardId, shardNumber, star } = getShardId(validator, metaChainShardId);
    validator = { ...validator, shardId, shardNumber, star };

    if (validator.isValidator) {
      validators.push(validator);
    }
    validatorsAndObservers.push(validator);

    allShardIDs.push(shardId.toString()); //TODO: check shardID

    if (validator.shardId && validator.shardId in shardData) {
      if (validator.isValidator) {
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
      shardData[shardId].allValidators = validator.isValidator ? 1 : 0;
      shardData[shardId].allActiveValidators = validator.isValidator && validator.isActive ? 1 : 0;
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
  //this gets all distinct shards
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

export type HeadersType = {
  id: string;
  label: string;
  dir: DirectioinsType;
};

type ToggleSortType = {
  oldDir: DirectioinsType;
  oldSortColumn: string;
  currentSortColumn: string;
};

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
