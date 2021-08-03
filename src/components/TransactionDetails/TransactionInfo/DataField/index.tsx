import * as React from 'react';
import { Anchorme, LinkComponentProps } from 'react-anchorme';
import { DetailItem } from 'sharedComponents';
import useScamDetect from './helpres/useScamDetect';

const CustomLink = (props: LinkComponentProps) => {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('click');
  };

  return <a {...props} onClick={onClick} />;
};

const DataField = ({ data }: { data?: string }) => {
  const scamDetect = useScamDetect();
  const [showData, setShowData] = React.useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const dataString = data ? Buffer.from(data, 'base64').toString() : 'N/A';

  return (
    <DetailItem title="Input Data">
      {showData ? (
        <>
          <div className="textarea form-control col cursor-text mt-1">
            <Anchorme linkComponent={CustomLink} target="_blank" rel="noreferrer noopener">
              {dataString}
            </Anchorme>
          </div>
        </>
      ) : (
        <>
          <textarea
            readOnly
            className="form-control col cursor-text mt-1"
            rows={2}
            value={scamDetect(dataString)}
          />
        </>
      )}
      <a href="/#" onClick={show}>
        {!showData ? 'Show' : 'Hide'} original message
      </a>
    </DetailItem>
  );
};

export default DataField;
