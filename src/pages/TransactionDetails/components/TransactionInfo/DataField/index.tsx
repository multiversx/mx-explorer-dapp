import React, { useEffect, useState } from 'react';
import { Anchorme } from 'react-anchorme';
import { useLocation, useNavigate } from 'react-router-dom';

import { MAX_DISPLAY_TX_DATA_LENGTH } from 'appConstants';
import { DetailItem, ModalLink, DataDecode } from 'components';
import { DecodeMethodType } from 'components/DataDecode';
import { truncate } from 'helpers';
import { useScamFlag, useNetworkRoute } from 'hooks';
import { ScamInfoType } from 'types';

export const DataField = ({
  data,
  scamInfo
}: {
  data?: string;
  scamInfo?: ScamInfoType;
}) => {
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const { hash, pathname } = useLocation();

  const hashDecodeMethod = hash.replace('#', '');
  const initialDecodeMethod =
    hashDecodeMethod &&
    Object.values<string>(DecodeMethodType).includes(hashDecodeMethod)
      ? hashDecodeMethod
      : DecodeMethodType.raw;
  const [decodeMethod, setDecodeMethod] = useState<string>(hashDecodeMethod);
  const scamFlag = useScamFlag();
  const [showData, setShowData] = useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const dataString = data ? Buffer.from(data, 'base64').toString() : 'N/A';
  const { stringWithLinks, output, found } = scamFlag(dataString, scamInfo);

  useEffect(() => {
    if (decodeMethod && decodeMethod !== DecodeMethodType.raw) {
      const options = {
        pathname: networkRoute(location.pathname),
        hash: decodeMethod
      };
      navigate(options, { replace: true });
    }
  }, [decodeMethod, pathname]);

  return (
    <DetailItem title='Input Data' className='data-field'>
      {showData ? (
        <div className='textarea form-control col cursor-text mt-1'>
          <Anchorme
            linkComponent={ModalLink}
            target='_blank'
            rel='noreferrer noopener'
          >
            {stringWithLinks}
          </Anchorme>
        </div>
      ) : (
        <DataDecode
          value={truncate(output, MAX_DISPLAY_TX_DATA_LENGTH)}
          initialDecodeMethod={initialDecodeMethod}
          setDecodeMethod={setDecodeMethod}
        />
      )}
      {found && (
        <a href='/#' onClick={show} className='small-font text-muted'>
          {!showData ? 'Show' : 'Hide'} original message
        </a>
      )}
    </DetailItem>
  );
};
