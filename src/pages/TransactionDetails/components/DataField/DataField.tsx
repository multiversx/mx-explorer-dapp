import React, { useEffect, useState } from 'react';
import { Anchorme } from 'react-anchorme';
import { useLocation, useNavigate } from 'react-router-dom';

import { MAX_DISPLAY_TX_DATA_LENGTH } from 'appConstants';
import { DetailItem, ModalLink, DataDecode } from 'components';
import { DecodeMethodEnum } from 'components/DataDecode';
import { truncate } from 'helpers';
import {
  useScamFlag,
  useNetworkRoute,
  useActiveRoute,
  useGetTransactionUrlHashParams
} from 'hooks';
import { transactionsRoutes } from 'routes';
import { ScamInfoType, WithClassnameType } from 'types';

export interface DataFieldUIType extends WithClassnameType {
  data?: string;
  scamInfo?: ScamInfoType;
  skipDataScamCheck?: boolean;
}

export const DataField = ({
  data,
  scamInfo,
  skipDataScamCheck
}: DataFieldUIType) => {
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const activeRoute = useActiveRoute();
  const scamFlag = useScamFlag();
  const { pathname } = useLocation();

  const { id, dataDecode } = useGetTransactionUrlHashParams();

  const [decodeMethod, setDecodeMethod] =
    useState<DecodeMethodEnum>(dataDecode);
  const [showData, setShowData] = useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const dataString = data ? Buffer.from(data, 'base64').toString() : 'N/A';
  const { stringWithLinks, output, found } = scamFlag(dataString, scamInfo);

  useEffect(() => {
    const isDataFieldDecode =
      decodeMethod &&
      decodeMethod !== DecodeMethodEnum.raw &&
      !id &&
      !activeRoute(transactionsRoutes.transactionDetailsLogs);

    if (isDataFieldDecode) {
      const options = {
        pathname: networkRoute(location.pathname),
        hash: decodeMethod
      };

      navigate(options, { replace: true });
    }
  }, [decodeMethod, pathname]);

  const showRawLinks =
    decodeMethod === DecodeMethodEnum.raw && (showData || skipDataScamCheck);
  const value = truncate(
    skipDataScamCheck ? dataString : output,
    MAX_DISPLAY_TX_DATA_LENGTH
  );

  return (
    <DetailItem title='Input Data' className='data-field'>
      <DataDecode
        value={value}
        initialDecodeMethod={!id ? dataDecode : DecodeMethodEnum.raw}
        setDecodeMethod={setDecodeMethod}
      >
        {showRawLinks && (
          <Anchorme
            linkComponent={ModalLink}
            target='_blank'
            rel='noreferrer nofollow noopener'
          >
            {stringWithLinks}
          </Anchorme>
        )}
      </DataDecode>
      {found && !skipDataScamCheck && (
        <a href='/#' onClick={show} className='small-font text-muted'>
          {!showData ? 'Show' : 'Hide'} original message
        </a>
      )}
    </DetailItem>
  );
};
