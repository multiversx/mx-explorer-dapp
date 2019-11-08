import { ValidatorType, ShardDataType } from './../index';

export function populateValidatorsTable(data: ValidatorType[]) {
  const validatorsAndObservers = data;
  const validatorsAndObserversLength = data.length;

  const shardData: ShardDataType = {};
  const allShardIDs: string[] = [];
  const validators: ValidatorType[] = [];

  data.forEach((validator: ValidatorType, i) => {
    const { shardId, shardNumber, star } = getShardId(validator);
    validator = { ...validator, shardId, shardNumber, star };

    if (validator.isValidator) {
      validators.push(validator);
    }

    allShardIDs.push(validatorsAndObservers[i].computedShardID.toString()); //TODO: check shardID

    if (validator.shardId && validator.shardId in shardData) {
      if (validator.isValidator) {
        const shardID = validator.shardId;
        shardData[shardID].allValidators = shardData[shardID].allValidators + 1;
        shardData[shardID].allActiveValidators = validator.isActive
          ? shardData[shardID].allActiveValidators + 1
          : shardData[shardID].allActiveValidators;
      }
    } else if (validator.shardId) {
      const shardID = validator.shardId;
      shardData[shardID] = {
        allValidators: 0,
        allActiveValidators: 0,
      };
      shardData[shardID].allValidators = validator.isValidator ? 1 : 0;
      shardData[shardID].allActiveValidators = validator.isValidator && validator.isActive ? 1 : 0;
    }
  });

  const validatorsLength = validators.length;
  const filteredValidators = validators;
  const filteredValidatorsLength = validators.length;
  const shownValidatorsLength = validators.length;

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
  const shardsList = [...Array.from(new Set(allShardIDs))]; // eslint-disable-line
  return {
    shardData: shardDataArray,
    shardsList,
    validatorsLength,
    filteredValidators,
    filteredValidatorsLength,
    shownValidatorsLength,
    validatorsAndObserversLength,
  };
  //   checkShardFilter();
  //   filterGrid();
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

function getShardId(validator: ValidatorType) {
  let shardId: string;
  let star = false;
  if (validator.isValidator === true) {
    shardId = validator.computedShardID.toString();
    if (validator.isActive === true && validator.computedShardID !== validator.receivedShardID) {
      star = true;
    }
  } else {
    shardId = validator.receivedShardID.toString();
  }
  return {
    shardId: shardId === (4294967295).toString() ? 'Metachain' : shardId, // eslint-disable-line
    shardNumber: parseInt(shardId), // this is excluding the Metachain string, used for searching
    star: star,
  };
}
