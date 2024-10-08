import { useLocation } from 'react-router-dom';

import { DecodeMethodEnum } from 'components/DataDecode';
import { useGetTransactionDecodeFilters } from 'hooks';

export interface TransactionDecodeParamasType {
  id: string;
  order: number;
  dataDecode: DecodeMethodEnum;
  topicsDecode: DecodeMethodEnum;
  additionalDataDecode: DecodeMethodEnum;
}

export const useGetTransactionUrlHashParams =
  (): TransactionDecodeParamasType => {
    const { hash } = useLocation();
    const {
      id,
      order,
      dataDecode: paramDataDecode,
      topicsDecode: paramsTopicsDecode,
      additionalDataDecode: paramsAdditionalDataDecode
    } = useGetTransactionDecodeFilters();

    if (id && order !== undefined) {
      return {
        id,
        order,
        dataDecode: paramDataDecode,
        topicsDecode: paramsTopicsDecode,
        additionalDataDecode: paramsAdditionalDataDecode
      };
    }

    // hash order: id/order/dataDecode/topicsDecode/additionalDataDecode
    const hashArray = hash.replace('#', '').split('/');
    const [firstParam, secondParam, thirdParam, fourthParam, fifthParam] =
      hashArray;

    if (
      hashArray.length === 1 &&
      Object.values<string>(DecodeMethodEnum).includes(firstParam)
    ) {
      return {
        id: '',
        order: 0,
        dataDecode: firstParam as DecodeMethodEnum,
        topicsDecode: DecodeMethodEnum.raw,
        additionalDataDecode: DecodeMethodEnum.raw
      };
    }

    if (
      hashArray.length === 2 &&
      Object.values<string>(DecodeMethodEnum).includes(secondParam)
    ) {
      return {
        id: firstParam,
        order: 0,
        dataDecode: secondParam as DecodeMethodEnum,
        topicsDecode: DecodeMethodEnum.raw,
        additionalDataDecode: DecodeMethodEnum.raw
      };
    }

    const topicsDecode = Object.values<string>(DecodeMethodEnum).includes(
      thirdParam
    )
      ? (thirdParam as DecodeMethodEnum)
      : DecodeMethodEnum.raw;

    const dataDecode = Object.values<string>(DecodeMethodEnum).includes(
      fourthParam
    )
      ? (fourthParam as DecodeMethodEnum)
      : DecodeMethodEnum.raw;

    const additionalDataDecode = Object.values<string>(
      DecodeMethodEnum
    ).includes(fifthParam)
      ? (fifthParam as DecodeMethodEnum)
      : DecodeMethodEnum.raw;

    return {
      id: firstParam,
      order: Number(secondParam),
      dataDecode,
      topicsDecode,
      additionalDataDecode
    };
  };
