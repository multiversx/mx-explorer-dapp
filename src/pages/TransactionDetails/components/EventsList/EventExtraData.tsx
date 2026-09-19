import { Dispatch, SetStateAction } from 'react';

import { DataDecode } from 'components';
import { DecodeMethodEnum } from 'lib';

interface EventExtraDataUIType {
  data: string[];
  identifier?: string;
  initialDecodeMethod?: DecodeMethodEnum;
  setDecodeMethod?: Dispatch<SetStateAction<DecodeMethodEnum>>;
}

export const EventExtraData = ({
  data,
  identifier,
  initialDecodeMethod,
  setDecodeMethod
}: EventExtraDataUIType) => {
  const mergedData = data.join('\n');

  return (
    <DataDecode
      value={mergedData}
      identifier={identifier}
      initialDecodeMethod={initialDecodeMethod}
      setDecodeMethod={setDecodeMethod}
    />
  );
};
