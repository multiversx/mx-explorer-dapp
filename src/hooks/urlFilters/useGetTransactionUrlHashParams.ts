import { useLocation } from 'react-router-dom';

import { DecodeMethodEnum } from 'components/DataDecode';

export const useGetTransactionUrlHashParams = () => {
  const { hash } = useLocation();

  // hash order: hashId/hashIndex/hashDecodeMethod/secondHashDecodeMethod/thirdHashDecodeMethod

  const hashArray = hash.replace('#', '').split('/');
  const [firstParam, secondParam, thirdParam, fourthParam, fifthParam] =
    hashArray;

  if (
    hashArray.length === 1 &&
    Object.values<string>(DecodeMethodEnum).includes(firstParam)
  ) {
    return {
      hashId: '',
      hashIndex: 0,
      hashDecodeMethod: firstParam as DecodeMethodEnum,
      secondHashDecodeMethod: DecodeMethodEnum.raw,
      thirdHashDecodeMethod: DecodeMethodEnum.raw
    };
  }

  if (
    hashArray.length === 2 &&
    Object.values<string>(DecodeMethodEnum).includes(secondParam)
  ) {
    return {
      hashId: firstParam,
      hashIndex: 0,
      hashDecodeMethod: secondParam as DecodeMethodEnum,
      secondHashDecodeMethod: DecodeMethodEnum.raw,
      thirdHashDecodeMethod: DecodeMethodEnum.raw
    };
  }

  const hashDecodeMethod = Object.values<string>(DecodeMethodEnum).includes(
    thirdParam
  )
    ? (thirdParam as DecodeMethodEnum)
    : DecodeMethodEnum.raw;

  const secondHashDecodeMethod = Object.values<string>(
    DecodeMethodEnum
  ).includes(fourthParam)
    ? (fourthParam as DecodeMethodEnum)
    : DecodeMethodEnum.raw;

  const thirdHashDecodeMethod = Object.values<string>(
    DecodeMethodEnum
  ).includes(fifthParam)
    ? (fifthParam as DecodeMethodEnum)
    : DecodeMethodEnum.raw;

  return {
    hashId: firstParam,
    hashIndex: secondParam,
    hashDecodeMethod,
    secondHashDecodeMethod,
    thirdHashDecodeMethod
  };
};
