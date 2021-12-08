import * as React from 'react';
import { Anchorme } from 'react-anchorme';
import { DetailItem, ModalLink } from 'sharedComponents';
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
  const scamFlag = useScamFlag();
  const [showData, setShowData] = React.useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const dataString = data ? Buffer.from(data, 'base64').toString() : 'N/A';
  const { stringWithLinks, output, found } = scamFlag(dataString, scamInfo);

  return (
    <DetailItem title="Input Data" className="data-field">
      {showData ? (
        <>
          <div className="textarea form-control col cursor-text mt-1">
            <Anchorme linkComponent={ModalLink} target="_blank" rel="noreferrer noopener">
              {stringWithLinks}
            </Anchorme>
          </div>
        </>
      ) : (
        <>
          <textarea
            readOnly
            className="form-control col cursor-text mt-1"
            rows={2}
            value={truncate(output, displayedDataLength)}
          />
        </>
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
