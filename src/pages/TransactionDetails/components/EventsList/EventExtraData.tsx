import { Dispatch, SetStateAction } from 'react';

import { DataDecode, DecodeMethodEnum } from 'components';

interface EventExtraDataType {
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
}: EventExtraDataType) => {
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
