import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Anchorme } from 'react-anchorme';
import { DetailItem, ModalLink, DataDecode } from 'sharedComponents';
import { truncate, useScamFlag } from 'helpers';
import { displayedDataLength } from 'appConfig';

const DataField = ({
  data,
  scamInfo,
}: {
  data?: string;
  scamInfo?: {
    type: string;
    info: string;
  };
}) => {
  const { hash, pathname } = useLocation();
  const hashDecodeMethod = hash.replace('#', '');
  const initialDecodeMethod =
    hashDecodeMethod && ['raw', 'text', 'decimal', 'smart'].includes(hashDecodeMethod)
      ? hashDecodeMethod
      : 'raw';
  const [decodeMethod, setDecodeMethod] = React.useState<string>(hashDecodeMethod);
  const scamFlag = useScamFlag();
  const [showData, setShowData] = React.useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const dataString = data ? Buffer.from(data, 'base64').toString() : 'N/A';
  const { stringWithLinks, output, found } = scamFlag(dataString, scamInfo);

  React.useEffect(() => {
    if (decodeMethod && decodeMethod !== 'raw') {
      window.history.replaceState(null, '', `${pathname}#${decodeMethod}`);
    }
  }, [decodeMethod, pathname]);

  return (
    <DetailItem title="Input Data" className="data-field">
      {showData ? (
        <div className="textarea form-control col cursor-text mt-1">
          <Anchorme linkComponent={ModalLink} target="_blank" rel="noreferrer noopener">
            {stringWithLinks}
          </Anchorme>
        </div>
      ) : (
        <DataDecode
          className="col"
          value={truncate(output, displayedDataLength)}
          initialDecodeMethod={initialDecodeMethod}
          setDecodeMethod={setDecodeMethod}
        />
      )}
      {found && (
        <a href="/#" onClick={show} className="small-font text-muted">
          {!showData ? 'Show' : 'Hide'} original message
        </a>
      )}
    </DetailItem>
  );
};

export default DataField;
