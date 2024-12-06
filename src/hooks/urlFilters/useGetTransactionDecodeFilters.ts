import { DecodeMethodEnum } from '@multiversx/sdk-dapp/types';
import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { useSearchParams } from 'react-router-dom';

const checkType = (type: string) =>
  type && Object.keys(DecodeMethodEnum).includes(type)
    ? (type as DecodeMethodEnum)
    : DecodeMethodEnum.raw;

export const useGetTransactionDecodeFilters = () => {
  const [searchParams] = useSearchParams();

  const dataDecode = searchParams.get('dataDecode')
    ? String(searchParams.get('dataDecode'))
    : '';
  const topicsDecode = searchParams.get('topicsDecode')
    ? String(searchParams.get('topicsDecode'))
    : '';
  const additionalDataDecode = searchParams.get('additionalDataDecode')
    ? String(searchParams.get('additionalDataDecode'))
    : '';
  const urlOrder =
    searchParams.get('order') !== undefined
      ? String(searchParams.get('order'))
      : '';

  const order = stringIsInteger(urlOrder) ? parseInt(urlOrder) : 0;

  return {
    id: searchParams.get('id') || searchParams.get('hash'),
    order,
    topicsDecode: checkType(topicsDecode),
    dataDecode: checkType(dataDecode),
    additionalDataDecode: checkType(additionalDataDecode)
  };
};
